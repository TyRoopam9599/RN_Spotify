import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, Pressable, FlatList } from 'react-native';
import { navigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import axios from 'axios';

const HomeScreen = () => {

  const [userProfile, setUserProfile] = useState();
  const [recentlyPlayed, SetRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState();

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
      // await SecureStore.setItemAsync("SpotifyID", data.id);
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

      const tracks = await response.data.items;
      //console.log("tracks:", response.data.items[0].id)
      SetRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getRecentlyPlayedSong();
  }, [])

  const renderItem = ({ item }) => {
    return (
      <Pressable style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginVertical: 8, backgroundColor: "#282828", borderRadius: 4, elevation: 3 }}>
        <Image style={styles.likePressable} source={{ uri: item.track.album.images[0].url }} />
        <View style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}>
          <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{item.track.name}</Text>
        </View>
      </Pressable>
    );
  };

  const getTopArtists = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("spotifyAccessToken");
      //console.log("ac token: ", accessToken)
      if (!accessToken) {
        console.log("Access token not found");
        return;
      }

      const allArtistIds = []; 

      for (let i = 0; i < recentlyPlayed.length; i++) {
        const trackData = recentlyPlayed[i];
        console.log("trackdata: ",trackData)
        const trackArtists = trackData.track.artists;
        for (let j = 0; j < trackArtists.length; j++) {
          allArtistIds.push(trackArtists[j].id);
        }
      }
      const artistIdsString = allArtistIds.join(',');

      // const response = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIdsString}`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   }
      // });

      console.log("Top Artists: ", artistIdsString)
      //setTopArtists(response.data.items);
      // You can store the user's top song data in state or use it as needed
    } catch (error) {
      console.error('Error fetching user top song:', error);
    }
  };
  useEffect(() => {
    getTopArtists();
  }, []);

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 35 }} >

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
            <View>
              <Text style={styles.block3Text}>Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>

        {/* Fourth View*/}
        <FlatList
          data={recentlyPlayed}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ flex: 1, marginHorizontal: 10, gap: 10 }}
          nestedScrollEnabled={true}
        />

        <Text style={{ color: "white", fontSize: 19, fontWeight: "bold", marginHorizontal: 10, marginTop: 10 }}>
          Your Top Artists
        </Text>

        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView> */}

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


// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [topArtists, setTopArtists] = useState([]);

//   useEffect(() => {
//     const getTopItems = async () => {
//       try {
//         const accessToken = await SecureStore.getItemAsync("spotifyAccessToken");
//         if (!accessToken) {
//           console.log("Access token not found");
//           return;
//         }
//         const type = "artists";
//         const response = await axios.get(
//           `https://api.spotify.com/v1/me/top/${type}`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         setTopArtists(response.data.items);
//       } catch (err) {
//         console.log(err.message);
//       }
//     };

//     getTopItems();
//   }, []);
//   console.log(recentlyplayed);
//   return (
//     <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
//       <ScrollView style={{ marginTop: 50 }}>

//         <FlatList
//           data={recentlyplayed}
//           renderItem={renderItem}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//         />

//         <Text
//           style={{
//             color: "white",
//             fontSize: 19,
//             fontWeight: "bold",
//             marginHorizontal: 10,
//             marginTop: 10,
//           }}
//         >
//           Your Top Artists
//         </Text>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {topArtists.map((item, index) => (
//             <ArtistCard item={item} key={index} />
//           ))}
//         </ScrollView>

//         <View style={{ height: 10 }} />
//         <Text
//           style={{
//             color: "white",
//             fontSize: 19,
//             fontWeight: "bold",
//             marginHorizontal: 10,
//             marginTop: 10,
//           }}
//         >
//           Recently Played
//         </Text>
//         <FlatList
//           data={recentlyplayed}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item, index }) => (
//             <RecentlyPlayedCard item={item} key={index} />
//           )}
//         />
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({});