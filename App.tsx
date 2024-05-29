import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import {
  authorize,
  onAuthorizeFailure,
  onAuthorizeSuccess,
} from './lib/AuthorizeModule';

import DocumentPictureModule from './lib/DocumentPictureModule';
import {initializeZenId} from './lib/ZenIdModule';

const App = () => {
  useEffect(() => {
    const apiKey = '***BE_API_KEY***';
    const baseUrl = '***BE_URI***';

    initializeZenId(apiKey, baseUrl)
      .then(() => {
        console.log('ZenId initialized successfully');
      })
      .catch(error => {
        console.error('Error initializing ZenId:', error);
      });
    const successSubscription = onAuthorizeSuccess(() => {
      Alert.alert('Success', 'Authorized successfully');
    });

    const failureSubscription = onAuthorizeFailure(error => {
      Alert.alert('Failure', `Authorization failed: ${error}`);
    });

    return () => {
      successSubscription.remove();
      failureSubscription.remove();
    };
  }, []);
  const startDocumentPicture = async () => {
    try {
      const result = await DocumentPictureModule.startDocumentPictureActivity();
      Alert.alert('Success', `File path: ${result.filePath}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  const handleAuthorize = () => {
    authorize()
      .then(() => {
        console.log('Authorization request sent');
      })
      .catch(error => {
        console.error('Authorization error:', error);
      });
  };
  return (
    <View style={styles.container}>
      <Text>ZenId React Native Example</Text>
      <Button title="Authorize" onPress={handleAuthorize} />
      <Button title="Start Document Picture" onPress={startDocumentPicture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;
