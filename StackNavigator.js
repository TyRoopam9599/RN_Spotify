import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import LoginScreen from './Screens/LoginScreen';
import LikedSongsScreen from './Screens/LikedSongsScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                shadowOpacity: 4,
                shadowRadius: 5,
                elevation: 2,
                shadowOffset: {
                    width: 0,
                    height: -4
                },
                borderTopWidth: 0
            }
        }}>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarLabelStyle: { color: 'white' },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Entypo name='home' size={24} color="white" />
                        ) : (
                            <AntDesign name='home' size={22} color='white' />
                        )
                }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarLabelStyle: { color: 'white' },
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name='person' size={24} color="white" />
                        ) : (
                            <Ionicons name='person-outline' size={22} color='white' />
                        )
                }}
            />
        </Tab.Navigator>
    )
}

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name='Main' component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name='Liked' component={LikedSongsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;