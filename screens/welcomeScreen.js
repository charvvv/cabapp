import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const welcomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={{uri: 'https://media.istockphoto.com/id/842477368/vector/young-man-raising-his-arm-to-call-a-taxi.jpg?s=612x612&w=0&k=20&c=siQNfUZC4Uz3bFjLwfxeijJFdD0gdmOfc4OyXTmRRp8='}} style={styles.image}></ImageBackground>
      <View style={styles.bottom} >
        <Text style={styles.title}>Get Started with Uber</Text>
        <TouchableOpacity 
        onPress={()=> navigation.navigate('loginScreen')}
        style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
          
        </TouchableOpacity>
      </View>
    </View>
  )
}


export default welcomeScreen


const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "white"},
  image: {flex: 3, justifyContent: 'flex-start'},
  bottom: {flex: 1, justifyContent: 'center', backgroundColor: 'white', padding: 25},
  button: {backgroundColor: 'black', paddingVertical: 25, paddingHorizonal: 50, borderRadius: 10, width: '100%', alignItems: 'center'},
  buttonText: {color: 'white', fontSize: 30, fontWeight: "bold"},
  title: {fontSize: 27, fontWeight: 'bold', marginBottom: 20, color: 'black'}
})