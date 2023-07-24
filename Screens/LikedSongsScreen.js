import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, ActivityIndicator, FlatList, Image } from 'react-native'
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import SongItem from '../Components/SongItem'
import { Player } from '../PlayerContext'

const LikedSongsScreen = () => {
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [likedSongs, setLikedSongs] = useState([]);
    const { currentTrack, setCurrentTrack } = useContext(Player);

    const getLikedTracks = async () => {
        const access_token = await SecureStore.getItemAsync("spotifyAccessToken");
        console.log("Ac ", access_token)
        if (!access_token) {
            console.log("Access Token not found");
            return;
        }
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/tracks?offset=0&limit=50`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            // console.log("reposne: ",response)
            const tracks = await response.json();
            setLikedSongs(tracks.items)
            //console.log(likedSongs)
        } catch (err) {
            console.log("error in liked song: ", err.message)
        }
    }

    useEffect(() => {
        getLikedTracks();
    }, [])

    const playTrack = async () => {
        if (likedSongs.length > 0) {
            setCurrentTrack(likedSongs[0])
        }
        await play(likedSongs[0])
    }
    console.log("currentTracks: ", currentTrack)

    const play = async () => {

    }

    return (
        <>
            <LinearGradient colors={['#614385', '#516395']} style={{ flex: 1 }}>
                <ScrollView style={styles.mainConatiner}>
                    {/* backButton */}
                    <Pressable style={styles.MC_pressable} onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back' size={24} color='white' />
                    </Pressable>

                    {/* searchBar & Sort */}
                    <Pressable style={styles.mainConatiner2}>
                        <Pressable style={styles.searchbar}>
                            <AntDesign name='search1' size={20} color='white' />
                            <TextInput value={input} onChangeText={(text) => setInput(text)} placeholder='Find in Liked Song' placeholderTextColor='white' style={{ color: 'white', fontWeight: "500", marginRight: 10 }} />
                        </Pressable>

                        <Pressable style={styles.sort}>
                            <Text style={{ color: 'white' }}>Sort</Text>
                        </Pressable>
                    </Pressable>

                    {/* likedsong (as a title) and count*/}
                    <View style={{ height: 40 }} />
                    <View style={styles.mainConatiner3}>
                        <Text style={styles.MC3_Text1}>Liked Song</Text>
                        <Text style={styles.MC3_Text2}>{likedSongs.length} Songs</Text>
                    </View>

                    {/* play button and cross-bolnisi */}
                    <Pressable style={styles.mainConatiner4}>
                        <Pressable style={styles.MC4_Pressable}>
                            <AntDesign name='arrowdown' size={24} color='white' />
                        </Pressable>
                        <View style={styles.MC4_View}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1DB954" />
                            <Pressable style={styles.MC4_Pressable2}
                                onPress={playTrack}
                            >
                                <Entypo name="controller-play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </Pressable>

                    {/* likedSongs */}
                    {likedSongs.length === 0 ? (
                        <ActivityIndicator size="large" color="gray" /> // Show a loading indicator while data is being fetched
                    ) : (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={likedSongs}
                            renderItem={({ item }) => (
                                <SongItem item={item}
                                //onPress={play}
                                //isPlaying={item === currentTrack}
                                />
                            )}
                        />
                    )}
                </ScrollView>
            </LinearGradient>

            {currentTrack && (
                <Pressable
                    style={{
                        backgroundColor: "#5072A7",
                        width: "90%",
                        padding: 10, // Add the padding here
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 15,
                        position: "absolute",
                        borderRadius: 6,
                        left: 20,
                        bottom: 10,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={{ uri: currentTrack?.track?.album?.images[0].url }}
                        />
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 13,
                                width: 220,
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {currentTrack?.track?.name} •{" "}
                            {currentTrack?.track?.artists[0].name}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, }}>
                        <AntDesign name="heart" size={24} color="#1DB954" />
                        <Pressable>
                            <AntDesign name="pausecircle" size={24} color="white" />
                        </Pressable>
                    </View>
                </Pressable>
            )}
        </>
    )
}

export default LikedSongsScreen

const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
        marginTop: 40,
    },
    MC_pressable: {
        marginHorizontal: 10
    },

    mainConatiner2: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    searchbar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#42275a',
        padding: 9,
        borderRadius: 8,
        height: 38,
        overflow: 'hidden'
    },
    sort: {
        marginLeft: 10,
        backgroundColor: '#42275a',
        padding: 10,
        borderRadius: 8,
        height: 38
    },

    mainConatiner3: {
        marginHorizontal: 10
    },
    MC3_Text1: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },
    MC3_Text2: {
        color: 'white',
        fontSize: 13,
        marginTop: 5
    },

    mainConatiner4: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    MC4_Pressable: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: '#1DB954',
        justifyContent: 'center',
        alignItems: 'center'
    },
    MC4_View: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    MC4_Pressable2: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1DB954",
    },

    player: {
        backgroundColor: "#5072A7",
        width: "90%",
        padding: 10,
        marginBottom: 15,
        position: "absolute",
        borderRadius: 6,
        left: 10,
        bottom: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginHorizontal: 10
    },
    playerView1: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    playerView1Text: {
        fontSize: 13,
        width: 220,
        color: "white",
        fontWeight: "bold"
    },
    playerView2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    }
})