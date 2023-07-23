import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { encode } from 'base-64';

const LoginScreen = () => {

    const navigation = useNavigation();

    useEffect(() => {
        const checkToknenValidity = async () => {
            const accessToken = await SecureStore.getItemAsync("spotifyAccessToken");
            const expirationTime = await SecureStore.getItemAsync("expirationTime");

            if (accessToken && expirationTime) {
                const curreentTime = Date.now();
                if (curreentTime < parseInt(expirationTime, 10)) {
                    navigation.replace("Main");
                }
                else {
                    handleSpotifyAuthentication();
                    SecureStore.deleteItemAsync("token");
                    SecureStore.deleteItemAsync("expirationTime");
                }
            }
        }
        checkToknenValidity();
    }, []);

    const handleSpotifyAuthentication = async () => {
        const clientId = 'YOUR_CLIENT_ID';
        const redirectUri = 'REDIRECT_URI';
        const scopes = [
            'user-top-read', 
            'user-read-email',
            'user-read-private',
            'user-library-read',
            'user-library-modify',
            'user-read-recently-played',
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-public'
        ]; 
        const authUrl =
            `https://accounts.spotify.com/authorize` +
            `?response_type=code` +
            `&client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scopes.join(' '))}`;

        try {
            const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

            if (result.type === 'success') {
                const t = new Date() ;
                const code = result.url?.split('code=')[1];
                if (code) {
                    
                    const tokenResponse = await exchangeCodeForToken(code);

                    if (tokenResponse.access_token) {
                        const expirationTime = Date.now() + tokenResponse.expires_in * 1000; 
                        
                        await SecureStore.setItemAsync('spotifyAccessToken', tokenResponse.access_token);
                        await SecureStore.setItemAsync('expirationTime', expirationTime.toString())

                        navigation.navigate('Main')
                    } else {
                        console.error('Error exchanging token:', tokenResponse.error);
                    }
                } else {
                    console.error('Error: Missing authorization code');
                }
            } else if (result.type === 'cancel') {
                console.warn('Authentication was cancelled');
            } else {
                console.error('Authentication error:', result.message);
            }
        } catch (error) {
            console.error('Error during authentication:', error.message);
        }
    };
    
    const exchangeCodeForToken = async (code) => {
        const clientId = 'YOUR_CLIENT_ID';
        const clientSecret = 'CLIENT_SECRET';
        const redirectUri = 'REDIRECT_URI'; 
        const authHeader = `Basic ${encode(`${clientId}:${clientSecret}`)}`;

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code: code,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }).toString(),
            });

            return await response.json();
        } catch (error) {
            console.log(error)
            return { error: 'Failed to exchange token' };
        }
    };

    return (
        <LinearGradient colors={['#040306', '#131624']} style={styles.container}>
            <SafeAreaView>

                <View style={styles.view} />

                <Entypo name='spotify' size={80} color='#1DB954' style={styles.entypo} />
                <Text style={styles.text}>Millions of Songs Free on Spotify!</Text>

                <View style={styles.view} />

                <Pressable style={[{ backgroundColor: '#1DB954', }, styles.pressable]} onPress={handleSpotifyAuthentication}>
                    <Text style={{ fontSize: 20, fontWeight: '400' }}>Sign In with Spotify</Text>
                </Pressable>

                <Pressable style={[{ backgroundColor: '#131624', flexDirection: 'row', borderColor: 'white', borderWidth: 1, marginTop: 30 }, styles.pressable]}>
                    <MaterialIcons name="phone-android" size={24} color='white' />
                    <Text style={styles.LoginOptions}>Continue with phone number</Text>
                </Pressable>

                <Pressable style={[{ backgroundColor: '#131624', flexDirection: 'row', borderColor: 'white', borderWidth: 1 }, styles.pressable]}>
                    <AntDesign name="google" size={24} color='#EA4335' />
                    <Text style={styles.LoginOptions}>Continue with Google</Text>
                </Pressable>

                <Pressable style={[{ backgroundColor: '#131624', flexDirection: 'row', borderColor: 'white', borderWidth: 1 }, styles.pressable]}>
                    <Entypo name="facebook" size={24} color='#3B5998' />
                    <Text style={styles.LoginOptions}>Sign In with Facebook</Text>
                </Pressable>

            </SafeAreaView>
        </LinearGradient>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    view: {
        height: 80
    },
    entypo: {
        textAlign: 'center'
    },
    text: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
        marginHorizontal: 10
    },
    pressable: {
        padding: 10,
        marginLeft: "auto",
        marginRight: "auto",
        width: 300,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: 'center',
        marginVertical: 10
    },
    LoginOptions: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '400',
        color: 'white',
        fontSize: 17
    }
})