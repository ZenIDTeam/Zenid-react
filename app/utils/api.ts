import {exists, DocumentDirectoryPath} from '@dr.pogodin/react-native-fs';
import {PictureTakenResult} from '../../lib/ZenId/useOnPictureTaken';
import {
  MinedDataType,
  ZenIdResponseType,
} from '../../lib/ZenId/ZenIdResponseType';
import axiosInstance from './axiosInstance';
import {Buffer} from 'buffer';
import {TextEncoder} from 'text-encoding';
import {base64toBinary} from './base64toBinary';

export const apiKey = '***BE_API_KEY***';
export const baseUrl = '***BE_URI***';

export const getToken = async (
  challengeToken: string,
): Promise<{Response: string}> => {
  return axiosInstance
    .get(baseUrl + 'initSdk', {
      params: {
        token: challengeToken,
        api_key: apiKey,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error);
    });
};

export const sendSamplePicture = async ({
  filePath,
  signature,
  country,
  pageCode,
  role,
  stateIndex,
  file,
}: PictureTakenResult): Promise<MinedDataType | undefined> => {
  try {
    if (!(await exists(filePath))) {
      console.error('File does not exist');
      return;
    }
    const imageData = base64toBinary(file);
    console.log('Reading file');
    const encoder = new TextEncoder();

    const signatureData = encoder.encode(signature);
    const httpBodyData = new Uint8Array(
      imageData.length + signatureData.length,
    );
    httpBodyData.set(imageData, 0);
    httpBodyData.set(signatureData, imageData.length);

    const url = new URL(baseUrl + 'sample');

    url.searchParams.append('country', country.toString());
    url.searchParams.append('pageCode', pageCode.toString());
    url.searchParams.append('role', role.toString());
    url.searchParams.append('stateIndex', stateIndex.toString());
    url.searchParams.append('expectedSampleType', 'DocumentPicture');
    url.searchParams.append('api_key', apiKey);
    console.log('url', url.toString());

    const response = await axiosInstance
      .post(url.toString(), httpBodyData, {
        headers: {
          'Content-type': '"application/octet-stream"',
          Accept: 'application/json',
          'Content-Length': httpBodyData.length.toString(),
        },
      })
      .then(response => response.data)
      .catch(error => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server responded with status:', error.response.status);
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
        }
        console.error('Error config:', error.config);
      });

    const result = response as ZenIdResponseType;
    console.log(result);
    return result.MinedData;
  } catch (error) {
    console.log(
      JSON.stringify(error, ['message', 'arguments', 'type', 'name']),
    );
    console.error('Error uploading image:', error);
  }
};
