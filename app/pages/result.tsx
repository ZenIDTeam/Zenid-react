import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../App';

const ResultPage = ({
  route: {
    params: {data},
  },
}: NativeStackScreenProps<RootStackParamList, 'Result'>) => {
  return (
    <SafeAreaProvider>
      <View>
        <Text>FirstName: {data.FirstName.Text}</Text>
        <Text>LastName: {data.LastName.Text}</Text>
        <Text>Birthdate: {data.BirthDate.Text}</Text>
        <Text>Address: {data.Address}</Text>
        <Text>Bith Address: {data.BirthAddress.Text}</Text>
        <Text>ID number: {data.IdcardNumber.Text}</Text>
        <Text>Valid until: {data.ExpiryDate.Text}</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default ResultPage;
