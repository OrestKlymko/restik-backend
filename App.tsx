import React from 'react';
import { SafeAreaView, useColorScheme, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Navigation from './components/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GestureHandlerRootView style={[styles.gestureHandler, { backgroundColor: backgroundStyle.backgroundColor }]}>
                <Navigation />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gestureHandler: {
        flex: 1,
    },
});

export default App;
