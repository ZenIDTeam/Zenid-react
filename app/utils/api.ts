import {readFile} from '@dr.pogodin/react-native-fs';
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

export const sendSamplePicture = async (filePath: string) => {
  try {
    console.log('filePath', filePath);

    const data = await readFile(filePath, 'base64');

    console.log('file', data);
    // Odeslání souboru pomocí fetch
    const response = await fetch(
      baseUrl + 'sample?country=&expectedSampleType=DocumentPicture',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: data,
      },
    );

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
