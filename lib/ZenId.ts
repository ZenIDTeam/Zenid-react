import {
  NativeModules,
  requireNativeComponent,
  findNodeHandle,
  HostComponent,
} from 'react-native';

const {ZenIdModule} = NativeModules;

const DocumentPictureView = requireNativeComponent(
  'DocumentPictureView',
) as HostComponent<any>;

export default {
  initializeSdk() {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.initializeSdk()
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },

  initializeApiService(baseUrl: string, apiKey: string) {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.initializeApiService(baseUrl, apiKey)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },

  initAuthorizeButton(profile: string) {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.initAuthorizeButton(profile)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },

  initDocumentVerifierButton() {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.initDocumentVerifierButton()
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },

  activateTakeNextDocumentPicture(viewRef: any) {
    const viewId = findNodeHandle(viewRef);
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.activateTakeNextDocumentPicture(viewId)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },

  postDocumentPictureSample(filePath: string) {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.postDocumentPictureSample(filePath)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },
  authorize(responseToken: string) {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.authorize(responseToken)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },
  selectProfile(profileId = '') {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.selectProfile(profileId)
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },
  getChallengeToken() {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.getChallengeToken()
        .then((message: string) => resolve(message))
        .catch((error: string) => reject(error));
    });
  },
  DocumentPictureView,
};
