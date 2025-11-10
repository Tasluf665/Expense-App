import { Stack } from 'expo-router';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from 'react-native-paper';
import { persistor, store } from "../utils/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(Authentication)" />
            <Stack.Screen name="(Common)" />
          </Stack>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
