import {NativeModules} from 'react-native';

const {DocumentPictureModule} = NativeModules;

export default {
  startDocumentPictureActivity: () => {
    return new Promise((resolve, reject) => {
      DocumentPictureModule.startDocumentPictureActivity()
        .then(result => resolve(result))
        .catch(error => reject(error));
    });
  },
};
