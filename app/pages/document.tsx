import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ActivityIndicator, Alert, Button, View} from 'react-native';
import {RootStackParamList} from '../../App';
import ZenId, {PictureTakenResult, useOnPictureTaken} from '../../lib/ZenId';
import {useOnDocumentPictureStateChanged} from '../../lib/ZenId/useOnDocumentPictureStateChanged';

import {sendSamplePicture} from '../utils/api';

export const Document = ({
  navigation,
  route: {
    params: {configuration},
  },
}: NativeStackScreenProps<RootStackParamList, 'Document'>) => {
  const documentPictureViewRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePictureStateChanged = (state: string) => {
    console.log('Document Picture State Changed: ', state);
  };

  const handlePictureTaken = (response: PictureTakenResult) => {
    console.log('Document Picture Taken: ', response);
    setIsLoading(true);
    sendSamplePicture(response).then(data => {
      if (!data) {
        return;
      }
      navigation.navigate('Result', {data});
    });
  };

  useOnPictureTaken(handlePictureTaken);
  useOnDocumentPictureStateChanged(handlePictureStateChanged);

  return (
    <View style={{flex: 1}}>
      {!isLoading ? (
        <>
          <ZenId.DocumentPictureView
            configuration={configuration}
            ref={documentPictureViewRef}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};
