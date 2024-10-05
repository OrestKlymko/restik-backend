import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthScreen from './screens/AuthScreen';
import SearchScreen from './screens/SearchScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Search"
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        color = focused ? 'black' : '#996E4D';
                        switch (route.name) {
                            case 'Search':
                                iconName = focused ? 'search' : 'search';
                                break;
                            case 'Favorites':
                                iconName = focused ? 'star' : 'star';
                                break;
                            case 'Happy Hours':
                                iconName = focused ? 'happy' : 'happy';
                                break;
                            case 'Profile':
                                iconName = focused ? 'person' : 'person';
                                break;
                            case 'Last Chance':
                                iconName = focused ? 'hourglass' : 'hourglass';
                                break;
                            default:
                                iconName = 'accessibility-sharp';
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>;
                    },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#996E4D',
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60, // Висота панелі
                        backgroundColor: 'white', // Колір панелі
                    },
                    headerShown: false, // Приховуємо заголовок
                })}
            >
                <Tab.Screen name="Search" component={SearchScreen}/>
                <Tab.Screen name="Favorites" component={AuthScreen}/>
                <Tab.Screen name="Happy Hours" component={AuthScreen}/>
                <Tab.Screen name="Last chance" component={AuthScreen}/>
                <Tab.Screen name="Profile" component={AuthScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
