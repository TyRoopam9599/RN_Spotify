import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import axios from 'axios';

const HomeScreen = () => {

  const [userProfile, setUserProfile] = useState();
  const [recentlyplayed, SetRecentlyPlayed] = useState([]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    }
    else if (currentTime < 16) {
      return "Good Afternoon";
    }
    else {
      return "Good Evening";
    }
  }

  const message = greetingMessage();

  const getProfile = async () => {
    const accessToken = await SecureStore.getItemAsync('spotifyAccessToken')
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer  ${accessToken}`
        }
      })
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getProfile();
  }, [])

  const getRecentlyPlayedSong = async () => {
    const accessToken = await SecureStore.getItemAsync("spotifyAccessToken");
    try {
      const response = await axios({
        method: 'GET',
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log("response: ", response.data.items)
      const tracks = await response.data.Items
      //console.log("Tracks: ", tracks)
      SetRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getRecentlyPlayedSong();
  }, [])

  const handleItem = ({ item }) => {
    console.log("item: ", item)
    return (
      <Pressable style={{flex:1, flexDirection: 'row', justifyContent:'space-between', marginHorizontal:10, marginVertical:8, backgroundColor:'#282828', borderRadius4, elevation3}}>
        <Image source={{uri: item.track.album.images[0].url}} style={{height:55, width:55}}/>
        <View style={{flex:1, marginHorizontal:8, justifyContent:'center'}}>
          <Text style={styles.block3Text}>{item.track.name}</Text>
        </View>
      </Pressable>
    )
  }
  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 35 }}>

        {/* first View */}
        <View style={styles.mainContainer1}>
          <View style={styles.block1}>
            {userProfile ?
              (<Image source={{ uri: userProfile?.images[0].url }} style={styles.profilePhoto} />)
              :
              (<Ionicons name="person-circle" size={24} color="white" />)
            }
            <Text style={styles.block1Text}>{message}</Text>
          </View>
          <MaterialCommunityIcons name='lightning-bolt-outline' size={24} color='white' />
        </View>

        {/* Second View */}
        <View style={styles.mainContainer2}>
          <Pressable style={styles.Pressable}>
            <Text style={styles.PressableText}>Music</Text>
          </Pressable>

          <Pressable style={styles.Pressable}>
            <Text style={styles.PressableText}>Podcasts & Shows</Text>
          </Pressable>
        </View>

        {/* Third View*/}
        <View style={{ height: 10 }} />

        <View style={styles.mainContainer3}>
          <Pressable style={styles.MC3_Pressable}>
            <LinearGradient colors={['#33006f', '#ffffff', '#33006f']} style={{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
              <Pressable style={styles.likePressable}>
                <AntDesign name='heart' size={24} color='red' />
              </Pressable>
            </LinearGradient>
            <Text style={styles.block3Text}>Liked Song</Text>
          </Pressable>

          <View style={styles.MC3_Pressable}>
            <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.likePressable} />
            <View style={styles.randomArtist}>
              <Text style={styles.block3Text}>Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>

        {/* Fourth View*/}
        <FlatList
          data={recentlyplayed}
          renderItem={handleItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />

      </ScrollView>
    </LinearGradient>
  )
}

export default HomeScreen

const styles = StyleSheet.create({

  mainContainer1: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  block1: {
    flexDirection: 'row',
    alignItems: "center"
  },
  block1Text: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: 'white'
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },

  mainContainer2: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  Pressable: {
    backgroundColor: '#353535',
    padding: 10,
    borderRadius: 30
  },
  PressableText: {
    fontSize: 15,
    color: 'white'
  },

  mainContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 10
  },
  MC3_Pressable: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginVertical: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 5,
    elevation: 3,
  },
  likePressable: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  block3Text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white'
  }
})