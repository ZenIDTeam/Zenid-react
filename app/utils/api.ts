import {
  readFile,
  exists,
  DocumentDirectoryPath,
  stat,
} from '@dr.pogodin/react-native-fs';
import {PictureTakenResult} from '../../lib/ZenId/useOnPictureTaken';
import {
  MinedDataType,
  ZenIdResponseType,
} from '../../lib/ZenId/ZenIdResponseType';
export const apiKey = '***BE_API_KEY***';
export const baseUrl = '***BE_URI***';

export const getToken = async (
  challengeToken: string,
): Promise<{Response: string}> => {
  return fetch(
    baseUrl + 'initSdk?token=' + challengeToken + '&api_key=' + apiKey,
    {
      method: 'GET',
    },
  )
    .then(data => data.json())
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
}: PictureTakenResult): Promise<MinedDataType | undefined> => {
  try {
    console.log('filePath', DocumentDirectoryPath, filePath);
    if (!(await exists(filePath))) {
      console.error('File does not exist');
      return;
    }
    console.log('file exists');
    const stats = await stat(filePath);
    console.log('file stats', JSON.stringify(stats));
    const formData = new FormData();
    formData.append('picture', {
      uri: 'file://' + filePath,
      type: 'image/jpeg',
      name: filePath.split('/').at(-1) || '',
    });
    formData.append('signature', signature || '');
    const url = new URL(baseUrl + 'sample');
    url.searchParams.append('country', country.toString());

    url.searchParams.append('pageCode', pageCode.toString());
    url.searchParams.append('role', role.toString());
    url.searchParams.append('stateIndex', stateIndex.toString());
    url.searchParams.append('expectedSampleType', 'DocumentPicture');
    url.searchParams.append('api_key', apiKey);
    console.log('url', url.toString());

    // console.log('file', data);
    // Odeslání souboru pomocí fetch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const result = (await response.json()) as ZenIdResponseType;
    console.log(result);
    return result.MinedData;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
