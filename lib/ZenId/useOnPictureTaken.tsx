import {useCustomEventCallback} from './useCustomEventCallback';

export type PictureTakenResult = {
  stateIndex: number;
  role: number;
  country: number;
  documentCode: number;
  pageCode: number;
  signature: string;
  filePath: string;
};
type Callback = (event: PictureTakenResult) => void;

export const useOnPictureTaken = (callback: Callback) => {
  return useCustomEventCallback('onPictureTaken', (value: string) =>
    callback(JSON.parse(value) as PictureTakenResult),
  );
};
