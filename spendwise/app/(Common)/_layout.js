import { Stack } from "expo-router";

export default () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExpenseScreen" />
            <Stack.Screen name="IncomeScreen" />
            <Stack.Screen name="TransferScreen" />

            <Stack.Screen name="AccountScreen" />
            <Stack.Screen name="AccountDetails" />
            <Stack.Screen name="DetailsScreen" />
            <Stack.Screen name="AddNewWallet" />

            <Stack.Screen name="SettingsScreen" />
            <Stack.Screen name="CurrencyScreen" />
            <Stack.Screen name="CategoryListScreen" />
            <Stack.Screen name="AddCategoryScreen" />

            <Stack.Screen name="AboutScreen" />
            <Stack.Screen name="HelpScreen" />
        </Stack>
    );
};
