//
//  ZenId.swift
//  ZenIdNative
//
//  Created by Josef Kvapil on 15.05.2024.
//

import Foundation
import RecogLib_iOS

@objc(ZenIdModule)
class ZenIdModule: NSObject{
  
  private var baseUrl: String = "";
  private var apiKey:String = "";
  
  @objc(initialize:)
  func initialize(_ callback: RCTResponseSenderBlock){
    baseUrl = "test"
    apiKey = "test"
    callback(["ZenId initialized"])
  }
  
  @objc(isAuthorized:rejecter:)
  func isAuthorized(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
      resolve(true)
  }
  
  @objc(getChallengeToken:rejecter:)
  func getChallengeToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    resolve(ZenidSecurity.getChallengeToken())
  }
  
  @objc(getChallengeToken:rejecter:)
  func authorize(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    resolve(ZenidSecurity.getChallengeToken())
  }
  
  @objc(setConfig:key:)
  func setConfig(url: String, key: String){
    baseUrl = url;
    apiKey = key;
  }
}
