import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ZenId, {MinedDataType} from './lib/ZenId';
import {Home} from './app/pages/home';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Document} from './app/pages/document';
import {Text} from 'react-native';
import {apiKey, baseUrl} from './app/utils/api';

import ResultPage from './app/pages/result';

export type RootStackParamList = {
  Home: undefined;
  Document: undefined;
  Result: {data: MinedDataType};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    ZenId.initializeSdk()
      .then(message => {
        console.log(message);
        setIsLoading(false);
        return ZenId.initializeApiService(baseUrl, apiKey);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (isLoading) {
    return <Text>Initializing</Text>;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Document" component={Document} />
        <Stack.Screen name="Result" component={ResultPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
