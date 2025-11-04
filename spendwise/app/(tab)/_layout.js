import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from "../../constant/Colors";

export default () => {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.Primary,
            tabBarInactiveTintColor: Colors.DarkGray,
        }}>
            <Tabs.Screen
                name="HomeScreen"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="TransactionScreen"
                options={{
                    title: "Transaction",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ExportScreen"
                options={{
                    title: "Export",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="star" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ProfileScreen"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
};
