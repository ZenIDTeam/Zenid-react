import {NativeModules} from 'react-native';

const {ZenIdModule} = NativeModules;

export const initializeZenId = (apiKey, baseUrl) => {
  return new Promise((resolve, reject) => {
    ZenIdModule.initializeZenId(apiKey, baseUrl)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};
