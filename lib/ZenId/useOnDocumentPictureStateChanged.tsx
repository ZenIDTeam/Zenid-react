import {useCustomEventCallback} from './useCustomEventCallback';

type Callback = (state: string) => void;
export const useOnDocumentPictureStateChanged = (callback: Callback): void => {
  return useCustomEventCallback('onDocumentPictureStateChanged', callback);
};
