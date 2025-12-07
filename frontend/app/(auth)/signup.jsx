import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../themes/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useAuth from "../../hooks/useAuth.js";

const RegisterScreen = () => {
  const { register, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États de validation
  const [errors, setErrors] = useState({});

  // Fonction de validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!username.trim()) {
      newErrors.username = "Le nom est requis";
    } else if (username.trim().length < 2) {
      newErrors.username = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation de la confirmation
    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmation est requise";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setErrors({});
    if (!validateForm()) {
      return;
    }

    const result = await register(
      username.trim(),
      email.trim().toLowerCase(),
      password
    );

    if (result.success) {
      Alert.alert(
        "✅ Inscription réussie",
        `Bienvenue ${username} ! Votre compte a été créé avec succès`,
        [
          {
            text: "OK",
            onPress: () => router.replace("(auth)/login"),
          },
        ]
      );
    } else {
      Alert.alert("❌ Erreur d'inscription", result.error);
    }
  };

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const canRegister =
    username && email && password && confirmPassword && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🌐</Text>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Agadir Task Manager</Text>
          </View>

          {/* Message d'erreur global */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#f44336" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Champ Nom */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom complet</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.username && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={errors.name ? "#f44336" : COLORS.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    clearFieldError("username");
                  }}
                  editable={!loading}
                />
              </View>
              {errors.username && (
                <Text style={styles.fieldError}>{errors.username}</Text>
              )}
            </View>

            {/* Champ Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={errors.email ? "#f44336" : COLORS.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="exemple@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearFieldError("email");
                  }}
                  editable={!loading}
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldError}>{errors.email}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.password ? "#f44336" : COLORS.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 caractères"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearFieldError("password");
                  }}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password}</Text>
              )}
            </View>

            {/* Champ Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmez le mot de passe</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.confirmPassword ? "#f44336" : COLORS.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Retapez votre mot de passe"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearFieldError("confirmPassword");
                  }}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity
              onPress={handleRegister}
              style={[
                styles.registerButton,
                !canRegister && styles.registerButtonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={!canRegister}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>S&apos;inscrire</Text>
              )}
            </TouchableOpacity>

            {/* Lien vers Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity
                onPress={() => router.push("(auth)/login")}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🇲🇦 Ville Agadir 2025</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0080C8",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#f44336",
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
    color: "#333",
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
  inputWrapperError: {
    borderColor: "#f44336",
    borderWidth: 2,
    backgroundColor: "#ffebee",
  },
  fieldError: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  eye: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: "#0080C8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    fontSize: 15,
    color: "#666666",
  },
  loginLink: {
    fontSize: 15,
    color: "#0080C8",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    color: "#999999",
    fontSize: 14,
  },
});

export default RegisterScreen;
