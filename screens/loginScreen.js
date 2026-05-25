import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useState} from 'react'


export default function loginScreen({navigation}) {
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
    
        <Text style={styles.title}>Enter Phone Number</Text>
        <View  style={styles.input}>
          <TextInput style={styles.code} placeholder='+1'/>
          <TextInput style={styles.number} placeholder='Enter phone number'/>
        </View>
        <TouchableOpacity style={styles.continue} onPress={()=>navigation.navigate('homeScreen')}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        <Text style={styles.or} >Or</Text>
        <View>
          <TouchableOpacity style={styles.continue}>
            <Text style={styles.continueText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continue}>
            <Text style={styles.continueText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "white"},
  input: {flexDirection: 'row', alignItems: 'center'},
  title: {fontSize: 25, fontWeight: 'bold', marginBottom: 20, marginTop: 10},
  code: {flex: 1, height: 50, backgroundColor: 'gray', borderRadius: 8, marginRight: 10,marginLeft: 7, fontSize: 20, textAlign: 'center', width: '17%'},
  number: {height: 50, backgroundColor: 'gray', borderRadius: 8, fontSize: 18, width: '80%', marginRight: 7},
  continueText: {fontSize: 15, fontWeight: 'bold', color: 'white'},
  continue: {backgroundColor: 'black', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 20, padding: 10},
  or: {fontWeight: 'bold', fontSize: 25, textAlign: 'center'},
  countryWrap: {borderRightWidth: 1, borderRightColor: 'white', paddingRight: 10 }
});