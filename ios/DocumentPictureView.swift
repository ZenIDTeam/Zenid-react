import UIKit
import RecogLib_iOS

class DocumentPictureView: UIView, DocumentControllerDelegate {

    private var documentController: DocumentController?
    private let camera = Camera()
    private let cameraView = CameraView()
    private var initialConfiguration: NSDictionary?

    override init(frame: CGRect) {
        super.init(frame: frame)
        print("DocumentPictureView initialized with frame: \(frame)")
        setupView()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        print("DocumentPictureView initialized with coder")
        setupView()
    }

    private func setupView() {
        print("Setting up camera view")
        addSubview(cameraView)
        cameraView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            cameraView.leadingAnchor.constraint(equalTo: leadingAnchor),
            cameraView.trailingAnchor.constraint(equalTo: trailingAnchor),
            cameraView.topAnchor.constraint(equalTo: topAnchor),
            cameraView.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
        print("Camera view added and constraints set up")
    }

    @objc var configuration: NSDictionary? {
        didSet {
            print("Configuration set: \(String(describing: configuration))")
            configureController()
        }
    }

    private func configureController() {
        guard let configuration = configuration else {
            print("No initial configuration found")
            return
        }

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                print("Configuring DocumentController with configuration: \(configuration)")
                let showVisualisation = configuration["showVisualisation"] as? Bool ?? true
                let showHelperVisualisation = configuration["showHelperVisualisation"] as? Bool ?? true
                let showDebugVisualisation = configuration["showDebugVisualisation"] as? Bool ?? false
                let dataTypeRaw = configuration["dataType"] as? String ?? "picture"
                let roleRaw = configuration["role"] as? Int
                let countryRaw = configuration["country"] as? Int ?? 0
                let pageRaw = configuration["page"] as? Int
                let codeRaw = configuration["code"] as? Int
                let documentsRaw = configuration["documents"] as? [[String: Any]]
                let settingsRaw = configuration["settings"] as? [String: Any]

                let dataType: DataType = (dataTypeRaw == "video") ? .video : .picture
                let role: DocumentRole? = roleRaw != nil ? DocumentRole(rawValue: roleRaw!) : nil
                let country: Country = Country(rawValue: countryRaw)!
                let page: PageCodes? = pageRaw != nil ? PageCodes(rawValue: pageRaw!) : nil
                let code: DocumentCodes? = codeRaw != nil ? DocumentCodes(rawValue: codeRaw!) : nil

                let documents: [Document]? = documentsRaw?.compactMap { docDict in
                    guard let docRoleRaw = docDict["role"] as? Int,
                          let docCountryRaw = docDict["country"] as? Int,
                          let docPageRaw = docDict["page"] as? Int,
                          let docCodeRaw = docDict["code"] as? Int else { return nil }
                    let docRole = DocumentRole(rawValue: docRoleRaw)
                    let docCountry = Country(rawValue: docCountryRaw)
                    let docPage = PageCodes(rawValue: docPageRaw)
                    let docCode = DocumentCodes(rawValue: docCodeRaw)
                    return Document(role: docRole, country: docCountry, page: docPage, code: docCode)
                }

                let settings: DocumentVerifierSettings? = settingsRaw != nil ? DocumentVerifierSettings() : nil

                let documentControllerConfig = DocumentControllerConfiguration(
                    showVisualisation: showVisualisation,
                    showHelperVisualisation: showHelperVisualisation,
                    showDebugVisualisation: showDebugVisualisation,
                    showTextInstructions: true,
                    dataType: dataType,
                    role: role,
                    country: country,
                    page: page,
                    code: code,
                    documents: documents,
                    settings: settings
                )

                DispatchQueue.main.async {
                    do {
                        if self.documentController == nil {
                            print("Initializing DocumentController with camera: \(self.camera) and cameraView: \(self.cameraView)")
                            let modelsFolder = Bundle.main.bundleURL.appendingPathComponent("Models")
                            let urlPathOfModels = modelsFolder.appendingPathComponent("documents")
                            let urlPathOfMrzModels = modelsFolder.appendingPathComponent("mrz")

                            self.documentController = try DocumentController(camera: self.camera, view: self.cameraView, modelsUrl: urlPathOfModels, mrzModelsUrl: urlPathOfMrzModels)
                            self.documentController?.delegate = self
                            print("DocumentController initialized")
                        }
                        try self.documentController?.configure(configuration: documentControllerConfig)
                        print("DocumentController configured successfully")
                    } catch let error as NSError {
                        print("Failed to configure DocumentController: \(error), \(error.userInfo)")
                    }
                }
            } catch let error as NSError {
                print("Failed to configure DocumentController: \(error), \(error.userInfo)")
            }
        }
    }

    @objc func activateNextDocumentPicture() {
        documentController?.getDocumentResult()
        print("Picture taken")
    }

    func controller(_ controller: DocumentController, didScan result: DocumentResult, nfcCode: String) {
        print("Did scan document with NFC code: \(nfcCode)")
    }

    func controller(_ controller: DocumentController, didScan result: DocumentResult) {
        DispatchQueue.global(qos: .userInitiated).async {
            print("Processing scanned result")
            guard let image = result.signature?.image else {
                print("No image found in result")
                return
            }
            guard let uiImage = UIImage(data: image) else {
                print("Failed to create UIImage from result image data")
                return
            }
            let savedImage = self.saveImage(image: uiImage)
            let imageData = result.signature?.image.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
            let returnData: [String: Any] = [
                "stateIndex": result.state.rawValue,
                "role": result.role?.rawValue,
                "country": result.country?.rawValue,
                "documentCode": result.code?.rawValue,
                "pageCode": result.page?.rawValue,
                "signature": result.signature?.signature,
                "filePath": savedImage,
                "file": imageData
            ]

            do {
                let jsonData = try JSONSerialization.data(withJSONObject: returnData, options: [])
                let jsonString = String(data: jsonData, encoding: .utf8)!
                DispatchQueue.main.async {
                    RNEventEmitter.emitter.sendEvent(withName: "onPictureTaken", body: jsonString)
                }
            } catch let error as NSError {
                print("Error serializing result data: \(error), \(error.userInfo)")
            }
        }
    }

    func controller(_ controller: DocumentController, didRecord videoURL: URL) {
        print("Did record video at URL: \(videoURL)")
    }

    func controller(_ controller: DocumentController, didUpdate result: DocumentResult) {
        DispatchQueue.main.async {
            RNEventEmitter.emitter.sendEvent(withName: "onDocumentPictureStateChanged", body: result.state.rawValue)
            print("Did update document result: \(result)")
        }
    }

    func saveImage(image: UIImage) -> String {
        guard let data = image.jpegData(compressionQuality: 1) else {
            print("Failed to get JPEG data from UIImage")
            return ""
        }
        guard let directory = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false) as NSURL else {
            print("Failed to get documents directory")
            return ""
        }
        do {
            let filePath = directory.appendingPathComponent("snapshot.jpg")!
            try data.write(to: filePath)
            print("Saved image to \(filePath.absoluteString)")
            return filePath.absoluteString
        } catch let error as NSError {
            print("Failed to save image: \(error), \(error.userInfo)")
            return ""
        }
    }
}
