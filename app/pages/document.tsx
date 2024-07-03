import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ActivityIndicator, Alert, Button, View} from 'react-native';
import {RootStackParamList} from '../../App';
import ZenId, {PictureTakenResult, useOnPictureTaken} from '../../lib/ZenId';
import {useOnDocumentPictureStateChanged} from '../../lib/ZenId/useOnDocumentPictureStateChanged';

import {sendSamplePicture} from '../utils/api';
const filters = [
  {
    documentRole: 'ID',
    documentPage: 'FRONT_SIDE',
    documentCountry: 'CZ',
    documentCode: 1234,
  },
  // další filtry...
];
export const Document = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Document'>) => {
  const [enabledPictureButton, setEnabledPictureButton] = React.useState(false);
  const documentPictureViewRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTakeNextDocumentPicture = () => {
    ZenId.activateTakeNextDocumentPicture(documentPictureViewRef.current)
      .then(message => {
        Alert.alert('Next Document Picture', message as string);
      })
      .catch(error => {
        Alert.alert('Document Picture Error', error.message);
      });
  };

  const handlePictureStateChanged = (state: string) => {
    console.log('Document Picture State Changed: ', state);
    if (isNaN(Number(state))) {
      return;
    }
    if (Number(state) >= 3) {
      setEnabledPictureButton(true);
    } else {
      setEnabledPictureButton(false);
    }
  };

  const handlePictureTaken = (response: PictureTakenResult) => {
    console.log('Document Picture Taken: ', response);
    console.log(typeof response);
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
          <Button
            disabled={!enabledPictureButton && false}
            title="Take Picture"
            onPress={handleTakeNextDocumentPicture}
          />
          <ZenId.DocumentPictureView
            acceptableInput={filters}
            ref={documentPictureViewRef}
            style={{
              flex: 1,
              width: '100%',
              height: '50%',
            }}
          />
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};
