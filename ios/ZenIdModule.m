//
//  ZenIdModule.m
//  ZenIdNative
//
//  Created by Josef Kvapil on 15.05.2024.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ZenIdModule, NSObject)


RCT_EXTERN_METHOD(initialize:(RCTResponseSenderBlock) callback)
RCT_EXTERN_METHOD(isAuthorized:(RCTPromiseResolveBlock) resolve rejecter:(RCTRejectBlock))
RCT_EXTERN_METHOD(authorize:(RCTPromiseResolveBlock) resolve rejecter:(RCTRejectBlock))
RCT_EXTERN_METHOD(getChallengeToken:(RCTPromiseResolveBlock) resolve rejecter:(RCTRejectBlock))
@end
