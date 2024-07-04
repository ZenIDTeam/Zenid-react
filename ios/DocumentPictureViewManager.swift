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
