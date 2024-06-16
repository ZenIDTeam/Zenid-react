import UIKit
import React
import RecogLib_iOS

@objc(DocumentPictureViewManager)
class DocumentPictureViewManager: RCTViewManager {
  override func view() -> UIView! {
    return DocumentPictureView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class DocumentPictureView: UIView, DocumentControllerDelegate {
  
  private var documentController: DocumentController?
  private let camera = Camera()
  private let cameraView = CameraView()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupView()
  }
  
  private func setupView() {
 
    addSubview(cameraView)
    cameraView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      cameraView.leadingAnchor.constraint(equalTo: leadingAnchor),
      cameraView.trailingAnchor.constraint(equalTo: trailingAnchor),
      cameraView.topAnchor.constraint(equalTo: topAnchor),
      cameraView.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])
    
    let modelsFolder = Bundle.main.bundleURL.appendingPathComponent("Models")
    let urlPathOfModels = modelsFolder.appendingPathComponent("documents")
    let urlPathOfMrzModels = modelsFolder.appendingPathComponent("mrz")

    let documentControllerConfig = DocumentControllerConfiguration(
      showVisualisation: true,
      showHelperVisualisation: true,
      showDebugVisualisation: false,
      dataType: .picture,
      role: .Idc,
      country: .Cz,
      page: .F,
      code: nil,
      documents: nil,
      settings: nil
    )
    
    do {
      print("Initializing DocumentController with camera: \(camera) and cameraView: \(cameraView)")
      documentController = try DocumentController(camera: camera, view: cameraView, modelsUrl: urlPathOfModels, mrzModelsUrl: urlPathOfMrzModels)
      documentController?.delegate = self
      try documentController?.configure(configuration: documentControllerConfig)
      print("DocumentController initialized successfully")
    } catch {
      print("Failed to initialize DocumentController: \(error)")
    }
  }
  
  // Public method to activate taking next document picture
  @objc func activateNextDocumentPicture() {
    documentController?.getDocumentResult()
    print("Picture")
  }
  
  // DocumentControllerDelegate methods
  func controller(_ controller: DocumentController, didScan result: DocumentResult, nfcCode: String) {
    // Handle successful scan with NFC code
    print("Did scan document with NFC code: \(nfcCode)")
  }

  func controller(_ controller: DocumentController, didScan result: DocumentResult) {
    // Handle successful scan
    guard let image = result.signature?.image else { return }
    guard let uiImage = UIImage(data: image) else{ return }
    let savedImage = saveImage(image: uiImage )
    
    let returnData: [String: Any ] = [
      "stateIndex": result.state.rawValue,
      "role": result.role?.rawValue,
      "country": result.country?.rawValue,
      "documentCode": result.code?.rawValue ,
      "pageCode": result.page?.rawValue,
      "signature": result.signature?.signature,
      "filePath": savedImage,
    ]
    
    do {
        let jsonData = try JSONSerialization.data(withJSONObject: returnData, options: [])
        let jsonString = String(data: jsonData, encoding: .utf8)!
      RNEventEmitter.emitter.sendEvent(withName: "onPictureTaken", body: jsonString )
    } catch let error {
        print("error")
    }
   
  }

  func controller(_ controller: DocumentController, didRecord videoURL: URL) {
    // Handle video recording
    print("Did record video at URL: \(videoURL)")
  }

  func controller(_ controller: DocumentController, didUpdate result: DocumentResult) {
    // Handle state updates
    RNEventEmitter.emitter.sendEvent(withName: "onDocumentPictureStateChanged", body: result.state.rawValue)
    print("Did update document result: \(result)")

  }
  func saveImage(image: UIImage) -> String {
    guard let data = image.jpegData(compressionQuality: 1) else {
          return ""
      }
      guard let directory = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false) as NSURL else {
          return ""
      }
      do {
          try data.write(to: directory.appendingPathComponent("snapshot.jpg")!)
        print("picture location:\(directory.absoluteString!)snapshot.jpg")
          return "\(directory.absoluteString!)snapshot.jpg"
      } catch {
          print(error.localizedDescription)
          return ""
      }
  }
}
