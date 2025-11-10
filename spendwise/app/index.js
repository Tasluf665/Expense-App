import React from "react";
import { useFonts } from "expo-font";
import { Redirect } from "expo-router";

const index = () => {
  const [fontsLoaded] = useFonts({
    FunnelDisplay_Bold: require("../assets/fonts/Funnel_Display/FunnelDisplay_Bold.ttf"),
    FunnelDisplay_ExtraBold: require("../assets/fonts/Funnel_Display/FunnelDisplay_ExtraBold.ttf"),
    FunnelDisplay_Light: require("../assets/fonts/Funnel_Display/FunnelDisplay_Light.ttf"),
    FunnelDisplay_Medium: require("../assets/fonts/Funnel_Display/FunnelDisplay_Medium.ttf"),
    FunnelDisplay_Regular: require("../assets/fonts/Funnel_Display/FunnelDisplay_Regular.ttf"),
    FunnelDisplay_SemiBold: require("../assets/fonts/Funnel_Display/FunnelDisplay_SemiBold.ttf"),
    FunnelDisplay_VariableFont_wght: require("../assets/fonts/Funnel_Display/FunnelDisplay_VariableFont_wght.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return <Redirect href={"/SplashScreen"} />;
};

export default index;
