import { Stack } from "expo-router";

export default () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExpenseScreen" />
            <Stack.Screen name="IncomeScreen" />
            <Stack.Screen name="DetailsScreen" />
        </Stack>
    );
};
