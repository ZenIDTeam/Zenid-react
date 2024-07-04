import {
  NativeModules,
  requireNativeComponent,
  findNodeHandle,
  HostComponent,
} from 'react-native';
import {DocumentPictureViewProps} from './DocumentPictureViewType';

const {ZenIdModule} = NativeModules;
console.log(NativeModules);
const DocumentPictureView = requireNativeComponent(
  'DocumentPictureView',
) as HostComponent<DocumentPictureViewProps>;
console.log(ZenIdModule);
export default {
  initializeSdk() {
    return new Promise<string>((resolve, reject) => {
      ZenIdModule.initializeSdk()
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
