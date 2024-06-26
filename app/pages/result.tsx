import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../App';
import {flattenMinedData} from '../utils/flattenMinedData';

const ResultPage = ({
  route: {
    params: {data},
  },
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Result'>) => {
  const dataToPrint = flattenMinedData(data);
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          {dataToPrint &&
            dataToPrint.map(({key, value}) => (
              <Text style={styles.text} key={key}>
                {key}: {value}
              </Text>
            ))}
          <Button
            title="Finish"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        </>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    color: 'white',
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
});

export default ResultPage;
