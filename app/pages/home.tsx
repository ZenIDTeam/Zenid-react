import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../App';
import ZenId from '../../lib/ZenId';
import {getToken} from '../utils/api';

export const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [isSdkInitialized, setIsSdkInitialized] = React.useState(false);
  // const handleAuthorize = () => {
  //   ZenId.initAuthorizeButton('NFC')
  //     .then(message => {
  //       Alert.alert('Authorization', message);
  //       setIsSdkInitialized(true);
  //     })
  //     .catch(error => {
  //       Alert.alert('Authorization Error', error.message);
  //     });
  // };

  const handleAuthorize = async () => {
    const challengeToken = await ZenId.getChallengeToken();
    console.log('Challenge Token: ', challengeToken);
    const token = await getToken(challengeToken);
    console.log('Token: ', token.Response);
    if (!token?.Response) return;
    ZenId.authorize(token.Response)
      .then(message => {
        Alert.alert('Authorization', message);
        return ZenId.selectProfile('');
      })
      .then(message => {
        Alert.alert('Profile Selected', message);

        setIsSdkInitialized(true);
      })
      .catch(error => {
        Alert.alert('Authorization Error', error.message);
      });
  };
  return (
    <SafeAreaProvider>
      <View style={{flex: 1}}>
        <Text>Welcome to React Native with ZenId SDK</Text>
        <Button title="Authorize ZenId" onPress={handleAuthorize} />
        <Button
          disabled={!isSdkInitialized}
          title="Go to Document Verification"
          onPress={() => navigation.navigate('Document')}
        />
      </View>
    </SafeAreaProvider>
  );
};
