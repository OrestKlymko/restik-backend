import React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Navigation from './components/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: backgroundStyle.backgroundColor }}>
            <Navigation />
        </GestureHandlerRootView>
    );
}

export default App;
