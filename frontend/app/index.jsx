import { StyleSheet, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../themes/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });

    // check if it's first time

    const checkFirstLaunched = async () => {
      const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");

      setTimeout(async () => {
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          router.replace("(auth)/signup");
        } else {
          router.replace("(auth)/signup");
        }
      }, 1500);
    };
    checkFirstLaunched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary, "#FFFFFF"]}
      locations={[0, 0.6, 1]}
      style={styles.container}
    >
      <Animated.View style={animatedLogoStyle}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require("../assets/icon.png")}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  img: {
    width: 180,
    height: 180,
  },
});
