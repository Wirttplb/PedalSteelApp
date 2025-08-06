import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';


export default function RootLayout() {
    useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    });

  return(
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
    );
}
