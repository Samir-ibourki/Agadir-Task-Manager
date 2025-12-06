import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../themes/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      router.push("dashboard");
    } else {
      Alert.alert("Erreur", result.error);
    }
  };
  return (
    <SafeAreaView>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Welcome to Agadir Task Manager</Text>
      </View>

      {/* form */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.form}>
          <View style={styles.inputConatiner}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.secondary}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          <View style={styles.inputConatiner}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.secondary}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eye}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => router.navigate("(auth)/signup")}
            style={styles.signUpButton}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Create New Account</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 14,
    marginTop: 23,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 2,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: "#5a5959ff",
  },
  form: {
    paddingTop: 50,
    gap: 25,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  inputConatiner: {
    gap: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#eeeeeeb0",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#999",
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  inputFocused: {
    borderColor: COLORS.secondary,
    backgroundColor: "#F0F8FF",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#666666",
  },
  signUpButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
  },
  linkText: {
    color: COLORS.secondary,
    fontWeight: "500",
  },
});
