import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { KeyProvider } from './keyContext';

export default function RootLayout() {

    // Hide the navigation bar on Android
    useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('immersive'); // Add this line
    });

  return(
    <KeyProvider>
        <View style={{ flex: 1}}>
            <StatusBar hidden />
            <Stack>
                <Stack.Screen name="index" options={{
                    headerShown: false
                }} />
                <Stack.Screen name="settings" options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#211f1d', // your custom color
                    },
                    headerTintColor: '#ffffffff',
                    headerShadowVisible: false
                }} />
            </Stack>
        </View>
    </KeyProvider>
    );
}
