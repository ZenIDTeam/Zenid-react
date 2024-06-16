
import React
import Foundation
@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }
 public override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  open override func supportedEvents() -> [String] {
    return ["onDocumentPictureStateChanged","onPictureTaken"]
  }
}
