import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'

const profileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
    
    <TouchableOpacity 
    style ={styles.photoButton}>
      <Text style={styles.photoText}>Upload Profile  Photo!</Text>
    </TouchableOpacity>

    <View style={styles.infoContainer}>
      <Text style={styles.label}>Name</Text>
      <Text style={styles.input}>Charvi</Text>
    </View>

    <View style={styles.infoContainer}>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.input}>charvigmail.com</Text>
    </View>

    <View style={styles.infoContainer}>
      <Text style={styles.label}>Recent Rides</Text>
    </View>

    </View>
  )
}

export default profileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    padding: 20,
  },
  infoContainer:{
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    backgroundColor: 'black',
    marginTop: 15,
    borderRadius: 20,
    padding: 10
  },
  label: {
    fontSize: 20,
    color: 'white',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  input: {
    fontSize: 25,
    color: 'white',
  },
  photoButton: {
    height: 150,
    width: 150,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',

  },
  

});

