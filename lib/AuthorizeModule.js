import {NativeModules, NativeEventEmitter} from 'react-native';

const {AuthorizeModule} = NativeModules;
const authorizeEmitter = new NativeEventEmitter(AuthorizeModule);

export const authorize = () => {
  return new Promise((resolve, reject) => {
    AuthorizeModule.authorize()
      .then(() => resolve(true))
      .catch(error => reject(error));
  });
};

export const onAuthorizeSuccess = callback => {
  return authorizeEmitter.addListener('onAuthorizeSuccess', callback);
};

export const onAuthorizeFailure = callback => {
  return authorizeEmitter.addListener('onAuthorizeFailure', callback);
};
