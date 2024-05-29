import {NativeModules, NativeEventEmitter} from 'react-native';

const {NfcModule} = NativeModules;
const nfcEmitter = new NativeEventEmitter(NfcModule);

export const initializeNfc = () => {
  return new Promise((resolve, reject) => {
    NfcModule.initializeNfc()
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const handleNfcIntent = intent => {
  NfcModule.handleNfcIntent(intent);
};

export const onNfcStateChange = callback => {
  return nfcEmitter.addListener('onNfcStateChange', callback);
};

export const onNfcResult = callback => {
  return nfcEmitter.addListener('onNfcResult', callback);
};

export const onNfcError = callback => {
  return nfcEmitter.addListener('onNfcError', callback);
};
