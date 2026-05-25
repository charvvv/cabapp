import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, TextInput, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useState, useEffect, useRef, useCallback} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const suggestions = [
  {id: '1', icon: 'home-outline', label: 'home', sub: 'addhome'},
  {id: '2', icon: 'briefcase-outline', label: 'work', sub: 'addwork'}
]; 
const rideOptions = [
  {id: '1', icon: 'car-outline', label: 'ride', sub: 'affortable rides'},
  {id: '2', icon: 'bicycle-outline', label: 'moto', sub: 'affortable bike rides'},
  {id: '3', icon: 'cube-outline', label: 'package', sub: 'send items'},
  {id: '4', icon: 'restaurant-outline', label: 'eats', sub: 'food delivery'}
] 
const getGreeting = ()=>{
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning!';
  }
  else if (hour < 17) {
    return 'Good Afternoon!';
  }
  else if (hour < 21) {
    return 'Good Evening!';
  }
  else {
    return 'Welcome Back!'
  }

}
const recentKey = 'uber_clone_recent';
const maxRecent = 5;

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const getCurrentLocation = async()=>{
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });

    }
    catch(err) {
      console.log(err);

    }
  };

  useEffect(()=>{
    loadRecent();
  },[]);
  const loadRecent = async()=>{
    try{
      const raw = await AsyncStorage.getItem(recentKey);
      setRecentPlaces(raw?JSON.parse(raw): []);
    }
    catch{
      setRecentPlaces([]);
    }
  };
  const saveToRecent = async(name, address)=>{
    try{
      const current = recentPlaces.filter(r=>r.name !== name);
      const updated = [{name, address}, ...current].slice(0, maxRecent);
      await AsyncStorage.setItem(recentKey, JSON.stringify(updated));
      setRecentPlaces(updated);

    }
    catch{}
  };

  const fetchPlaces = useCallback(async(query)=>{
    if(query.trim().length<2){
      setResults([]);
      setShowResult(false);
      return;
    }
    setLoading(true);
    setShowResult(true);
    try{
      const url = `https://photon.komoot.io/api/` +
        `?q=${encodeURIComponent(query)}` +
        `&limit=6` +
        `&lang=en`;
        const res = await fetch(url);
        const data = await res.json();
        const features = data?.features??[];
        setResults(features);

    }
    catch(error){console.warn('searchError: ', error);
      setResults([]);
    }
    finally{
      setLoading(false);
    }
  }, [recentPlaces]);

  const onChangeSearch = (text) => {
    setSearchText(text);
    if(debounceRef.current)
      clearTimeout(debounceRef.current);
    if(text.trim().length<2){
      setShowResult(false);
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(()=>fetchPlaces(text), 400);

  };
  const parseFeature = (feature)=>{
    const p = feature.properties ?? {};
    const name = p.name || p.city || p.state || 'unknown';
    const addressParts = [
      p.street?`${p.street}${p.housenumber ? ' ' + p.housenumber : ''}`:null, 
      p.city || p.country || null, 
      p.state || null, 
      p.country || null,
    ].filter(Boolean);
    const address = addressParts.slice(0, 3).join(', ' );
    const[lon, lat] = feature.geometry?.coordinates ??[0, 0];
    return {name, address, lat, lon};

  };
  const selectPlace = (feature)=>{
    const {name, address, lat, lon} = parseFeature(feature);
    setDestination({latitude: lat, longitude: lon, title: name})
    setSearchText(name);
    setShowResult(false);
    setResults([]);
    Keyboard.dismiss();
    saveToRecent(name, address);

  };
const selectRecent = (item)=>{
  setSearchText(item.name);
  saveToRecent(item.name, item.address);
  Keyboard.dismiss();

};
const clearSearch = ()=>{
  setSearchText('');
  setResults([]);
  setShowResult(false);

};
const getResultIcon = (properties = {})=>{
  const type = (properties.type || '').toLowerCase();
  const osm_key = (properties.osm_key || '').toLowerCase();
  const osm_value = (properties.osm_value || '').toLowerCase();
  if(osm_key === 'aeroway' || osm_value === 'airport') return 'airplane-outline'; 
  if(osm_key === 'station' || osm_value === 'subway') return 'train-outline'; 
  if(osm_key === 'amenity' || osm_value === 'hospital') return 'medkit-outline'; 
  if(osm_key === 'amenity' || osm_value === 'university') return 'school-outline'; 
  if(osm_key === 'amenity' || osm_value === 'school') return 'school-outline'; 
  if(osm_key === 'amenity' || osm_value === 'restaurant') return 'restaurant-outline'; 
  if(osm_key === 'amenity' || osm_value === 'fast_food') return 'restaurant-outline'; 
  if(osm_key === 'tourism' || osm_value === 'hotel') return 'bed-outline'; 
  if(osm_key === 'highway' || osm_value === 'bus_stop') return 'bus-outline'; 
  if(type === 'city' || type === 'town' || type === 'village') return 'business-outline';
  if(type === 'street' || type === 'house') return 'navigation-outline';
  return 'location-outline';

}
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
        <View>
          <Text style={{fontSize: 20}}>{getGreeting()}</Text>
          <Text style={styles.heading}>Where to?</Text>
        </View>
        <TouchableOpacity style={{backgroundColor: 'gray', borderRadius: 30, width: 50, alignItems: 'center', justifyContent: 'center', height: 50}}>
          <Ionicons name= "person" size={20} color='black'/>
        </TouchableOpacity>
        </View>
        <View style={{position: 'relative', zIndex: 100}}>
      <View style={{flexDirection: 'row', gap: 10, padding: 10, borderWidth: 2, borderRadius: 10}}>
        <Ionicons name="search-outline" size={25} color='black' />
        <TextInput placeholder="Where to?" placeholderTextColor= 'gray'
        value = {searchText}
        onChangeText = {onChangeSearch}
        style={styles.searchInput}
        onFocus={()=>searchText.length >= 2 && setShowResult(true) } />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
          <Ionicons name="close-circle" size={18} color='#aaa'/>
          </TouchableOpacity>
        )}
      </View>
      {showResult && (
        <View style={styles.dropdown}>
          {loading?(
            <View style={styles.dropMessage}>
              <ActivityIndicator size="small" color="#111"/>
              <Text>Searching</Text>
            </View>
          ):results.length === 0?(
            <View style={styles.dropCenter}>
              <Text style={styles.dropMessage}>No Places Found</Text>

            </View>
          ):(
            <FlatList 
            data={results} keyExtractor={(_,i)=>String(i)}
            style={{maxHeight: 280}} 
            renderItem={({item})=>{
              const {name, address} = parseFeature(item);
              return(
                <TouchableOpacity style={styles.resultRow} onPress= {()=>selectPlace(item)}
                activeOpacity={0.7}>
                  <View style={styles.resultIcon}>
                    <Ionicons name={getResultIcon(item.properties)} size={18} color="#111"/>
                  </View>
                  <View style={styles.resultText}>
                    <Text style={styles.resultName}>
                      {name}
                    </Text>
                    <Text style={styles.resultAddress}>{address}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
            />
          )}
        </View>
      )}
      </View>
      <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', padding: 10 }}>
        {rideOptions.map((opt)=>(
          <TouchableOpacity  style={{alignItems: 'center'}} key={opt.id}>
            <View style={{width: 60, height: 60, backgroundColor: '#f3f3f3', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 5}}>
              <Ionicons name={opt.icon} size={24} color='black'/>
            </View>
            <Text>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mapContainer}>
          {currentLocation && (
            <MapView style={styles.map} initialRegion={currentLocation} showsUserLocation showsMyLocationButton>
              <Marker coordinate={currentLocation}
              title="you"/>
              {destination && (
                <Marker coordinate={destination} title={destination.title} pinColor="green"/>
              )}
              {destination && (
                <Polyline coordinate={[currentLocation, destination]} strokeWidth={4} strokeColor="#111"/>
              )}
            </MapView>
          )}
      </View>
      <ScrollView>
          <Text>Saved Places</Text>
          {suggestions.map((item)=>(
            <TouchableOpacity style={{}} key={item.id}>
              <View>
                <Ionicons name={item.icon} size={20} color='black' />
              </View>
              <View>
                <Text>{item.label}</Text>
                <Text>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    color: "black"

  },
  searchInput: {
    flex: 1,
    fontSize: 16, 
    color: '#111'
  },
  dropdown: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 200
  },
  dropCenter: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  dropMessage: {
    color: '#888',
    fontSize: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  resultIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#f3f3f3', 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111'
  },
  resultAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 2
  }
});