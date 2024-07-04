import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../App';
import ZenId from '../../lib/ZenId';

import {getToken} from '../utils/api';
import {
  idBackConfiguration,
  idConfiguration,
  pasConfiguration,
  rkConfiguration,
} from '../utils/configurations';

export const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [isSdkInitialized, setIsSdkInitialized] = React.useState(false);
  const [isAuthorizing, setIsAuthorizing] = React.useState(false);
  const [isDebugVisualisationEnabled, setIsDebugVisualisationEnabled] =
    React.useState(true);
  const [isVisualisationEnabled, setIsVisualisationEnabled] =
    React.useState(true);
  const [isHelperVisualisationEnabled, setIsHelperVisualisationEnabled] =
    React.useState(true);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
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
        setIsAuthorizing(false);
        setIsSdkInitialized(true);
      })
      .catch(error => {
        Alert.alert('Authorization Error', error.message);
      });
  };
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to React Native with ZenId SDK</Text>
        <Button
          title="Authorize ZenId"
          onPress={handleAuthorize}
          disabled={isAuthorizing || isSdkInitialized}
        />
        <Button
          disabled={!isSdkInitialized}
          title="ID Verification"
          onPress={() =>
            navigation.navigate('Document', {
              name: 'ID Verification',
              configuration: {
                ...idConfiguration,
                showDebugVisualisation: isDebugVisualisationEnabled,
                showVisualisation: isVisualisationEnabled,
                showHelperVisualisation: isHelperVisualisationEnabled,
              },
            })
          }
        />
        <Button
          disabled={!isSdkInitialized}
          title="ID Back Verification"
          onPress={() =>
            navigation.navigate('Document', {
              name: 'ID Back Verification',
              configuration: {
                ...idBackConfiguration,
                showDebugVisualisation: isDebugVisualisationEnabled,
                showVisualisation: isVisualisationEnabled,
                showHelperVisualisation: isHelperVisualisationEnabled,
              },
            })
          }
        />
        <Button
          disabled={!isSdkInitialized}
          title="Drive License Verification"
          onPress={() =>
            navigation.navigate('Document', {
              name: 'Drive License Verification',
              configuration: {
                ...rkConfiguration,
                showDebugVisualisation: isDebugVisualisationEnabled,
                showVisualisation: isVisualisationEnabled,
                showHelperVisualisation: isHelperVisualisationEnabled,
              },
            })
          }
        />
        <Button
          disabled={!isSdkInitialized}
          title="Passport Verification"
          onPress={() =>
            navigation.navigate('Document', {
              name: 'Passport Verification',
              configuration: {
                ...pasConfiguration,
                showDebugVisualisation: isDebugVisualisationEnabled,
                showVisualisation: isVisualisationEnabled,
                showHelperVisualisation: isHelperVisualisationEnabled,
              },
            })
          }
        />
        <View>
          <Text>Enable Visualisation</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isVisualisationEnabled}
              onValueChange={value => setIsVisualisationEnabled(value)}
            />
          </View>
        </View>
        <View>
          <Text>Enable Helper Visualisation</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isHelperVisualisationEnabled}
              onValueChange={value => setIsHelperVisualisationEnabled(value)}
            />
          </View>
        </View>
        <View>
          <Text>Enable Debug Visualisation</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isDebugVisualisationEnabled}
              onValueChange={value => setIsDebugVisualisationEnabled(value)}
            />
          </View>
        </View>

        {isAuthorizing && <ActivityIndicator size="large" />}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  text: {
    marginBottom: 20,
  },
  switchContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
