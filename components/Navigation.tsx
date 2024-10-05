import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthScreen from './screens/AuthScreen';
import SearchScreen from './screens/SearchScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Search"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Search':
                                iconName = focused ? 'accessibility-sharp' : 'add';
                                break;
                            case 'Favorites':
                                iconName = focused ? 'accessibility-sharp' : 'add';
                                break;
                            case 'Happy Hours':
                                iconName = focused ? 'accessibility-sharp' : 'add';
                                break;
                            case 'Profile':
                                iconName = focused ? 'accessibility-sharp' : 'add';
                                break;
                            default:
                                iconName = 'accessibility-sharp';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60, // Явно вказуємо висоту навігаційної панелі
                        backgroundColor: 'white', // Упевнимось, що панель має фон
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="Favorites" component={AuthScreen} />
                <Tab.Screen name="Happy Hours" component={AuthScreen} />
                <Tab.Screen name="Profile" component={AuthScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
