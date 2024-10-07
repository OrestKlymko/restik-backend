import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthScreen from './screens/AuthScreen';
import SearchScreen from './screens/SearchScreen';
import FavoriteScreen from "./screens/FavoriteScreen.tsx";
import BenefitsScreen from "./screens/BenefitsScreen.tsx";

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
                            case 'Пошук':
                                iconName = focused ? 'search' : 'search';
                                break;
                            case 'Улюблене':
                                iconName = focused ? 'star-outline' : 'star-outline';
                                break;
                            case 'Щасливі години':
                                iconName = focused ? 'happy' : 'happy';
                                break;
                            case 'Профіль':
                                iconName = focused ? 'person-outline' : 'person-outline';
                                break;
                            case 'Вигоди':
                                iconName = focused ? 'bulb-outline' : 'bulb-outline';
                                break;
                            default:
                                iconName = 'accessibility-sharp';
                        }
                        return <Ionicons name={iconName} size={size} color={color}/>;
                    },
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#996E4D',
                    tabBarLabelStyle: {
                        fontFamily: 'PlusJakartaSans-Regular',  // Шрифт
                        fontSize: 12,                      // Розмір тексту
                        lineHeight: 18,                    // Висота рядка
                        textAlign: 'center',                 // Вирівнювання
                    },
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
                <Tab.Screen name="Пошук" component={SearchScreen}/>
                <Tab.Screen name="Улюблене" component={FavoriteScreen}/>
                <Tab.Screen name="Вигоди" component={BenefitsScreen}/>
                <Tab.Screen name="Профіль" component={AuthScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
