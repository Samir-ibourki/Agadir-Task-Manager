import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../themes/colors";
const { height } = Dimensions.get("window");

const PRIMARY_BLUE = "#007ACC";
const LIGHT_BLUE = "#B3E0FF";

const OnboardingScreen = () => {
  const logoScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(50);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(logoScale.value, { damping: 10, stiffness: 100 }) },
      ],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(textOpacity.value, { duration: 800 }),
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(
        800,
        withTiming(buttonsTranslateY.value === 0 ? 1 : 0, { duration: 500 })
      ),
      transform: [
        {
          translateY: withDelay(
            800,
            withSpring(buttonsTranslateY.value, { damping: 12, stiffness: 100 })
          ),
        },
      ],
    };
  });

  useEffect(() => {
    logoScale.value = 1;
    textOpacity.value = 1;
    buttonsTranslateY.value = 0;
  }, [buttonsTranslateY, logoScale, textOpacity]);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary, "#FFFFFF"]}
      locations={[0, 0.6, 1]}
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.iconBackground}>
          <Ionicons name="checkbox-outline" size={80} color={PRIMARY_BLUE} />
        </View>
        <Text style={styles.appName}>Agadir Task Manager 2025</Text>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>Organisez votre quotidien à Agadir</Text>
        <Text style={styles.subtitle}>
          Gérez facilement vos rendez-vous Moukawalati, vos examens BTS/OFPPT,
          et vos démarches administratives.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttonWrapper, buttonsAnimatedStyle]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("(auth)/login")}
        >
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("(auth)/signup")}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: height * 0.1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: LIGHT_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#3d3b3bff",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 40,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonWrapper: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  secondaryButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
