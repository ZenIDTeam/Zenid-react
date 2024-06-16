import Foundation
import RecogLib_iOS

@objc(ZenIdModule)
class ZenIdModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "ZenIdModule"
  }

 static func requiresMainQueueSetup() -> Bool {
    return true
  }
 

  @objc
  func isAuthorized(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(true)
  }

  @objc
  func getChallengeToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(ZenidSecurity.getChallengeToken())
  }

  @objc
  func authorize(_ token: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let authorized = ZenidSecurity.authorize(responseToken: token)
    if authorized {
      resolve("Authorized")
    } else {
      reject("AuthorizationError", "Failed to authorize", nil)
    }
  }

  @objc
  func initializeSdk(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve("SDK initialized successfully")
  }

  @objc
  func selectProfile(_ profile: String, resolve: RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let profileSelected = ZenidSecurity.selectProfile(name: profile)
    if profileSelected {
      resolve("Profile selected")
    } else
    {
      reject("ProfileSelectionError", "Failed to select profile", nil)
    }
  }

  @objc
   func activateNextDocumentPicture(_ viewTag: NSNumber, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
   print("ahoj")
   }
  
  
}
