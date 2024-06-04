import {useCustomEventCallback} from './useCustomEventCallback';

export type PictureTakenResult = {
  stateIndex: number;
  roleIndex: number;
  codeIndex: number;
  pageIndex: number;
  countryId: number;
  signature: string;
  filePath: string;
};
type Callback = (event: PictureTakenResult) => void;

export const useOnPictureTaken = (callback: Callback) => {
  return useCustomEventCallback('onPictureTaken', (value: string) =>
    callback(JSON.parse(value) as PictureTakenResult),
  );
};
