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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useTasks from "../hooks/useTasks";

const AddTaskScreen = () => {
  const { createTask, loading } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const categories = [
    { id: 1, label: "📋 Tâche générale", value: "" },
    { id: 2, label: "🏢 RDV Moukawalati", value: "RDV Moukawalati" },
    { id: 3, label: "📄 CNSS", value: "Télé-déclaration CNSS" },
    { id: 4, label: "🏛️ Commune", value: "Dépôt documents commune" },
    { id: 5, label: "📚 BTS/OFPPT", value: "Préparation examen" },
    { id: 6, label: "🏥 RAMED/AMO", value: "Rappel RAMED/AMO" },
    { id: 7, label: "🪪 Carte nationale", value: "Démarches carte nationale" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (title.trim().length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    } else if (title.trim().length > 200) {
      newErrors.title = "Le titre est trop long (max 200 caractères)";
    }

    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        newErrors.dueDate = "Format de date invalide (YYYY-MM-DD)";
      } else {
        const date = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(date.getTime())) {
          newErrors.dueDate = "Date invalide";
        } else if (date < today) {
          newErrors.dueDate = "La date ne peut pas être dans le passé";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction de création
  const handleCreateTask = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: selectedCategory.value
        ? `${selectedCategory.value} - ${title.trim()}`
        : title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
    };

    const result = await createTask(taskData);

    if (result.success) {
      Alert.alert("✅ Succès", "La tâche a été créée avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert("❌ Erreur", result.error);
    }
  };

  // Fonction pour effacer l'erreur d'un champ
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Vérifier si le formulaire peut être soumis
  const canSubmit = title.trim() && !loading;

  const setToday = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDueDate(formattedDate);
    clearFieldError("dueDate");
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    setDueDate(formattedDate);
    clearFieldError("dueDate");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle tâche</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Sélection de catégorie */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catégorie</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory.id === category.id &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory.id === category.id &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Titre */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Titre <Text style={styles.required}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.title && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={errors.title ? "#f44336" : "#0080C8"}
              />
              <TextInput
                style={styles.input}
                placeholder="Ex: Renouveler ma carte RAMED"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  clearFieldError("title");
                }}
                editable={!loading}
                maxLength={200}
              />
            </View>
            {errors.title && (
              <Text style={styles.fieldError}>{errors.title}</Text>
            )}
            <Text style={styles.hint}>{title.length}/200 caractères</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (optionnel)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#0080C8"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ajoutez des détails..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>
          </View>

          {/* Date d'échéance */}
          <View style={styles.section}>
            <Text style={styles.label}>Date d&apos;échéance (optionnel)</Text>

            {/* Boutons rapides */}
            <View style={styles.quickDateButtons}>
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={setToday}
                disabled={loading}
              >
                <Ionicons name="today-outline" size={18} color="#0080C8" />
                <Text style={styles.quickDateButtonText}>Aujourd&apos;hui</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={setTomorrow}
                disabled={loading}
              >
                <Ionicons name="calendar-outline" size={18} color="#0080C8" />
                <Text style={styles.quickDateButtonText}>Demain</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputWrapper,
                errors.dueDate && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={errors.dueDate ? "#f44336" : "#0080C8"}
              />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (ex: 2025-12-31)"
                value={dueDate}
                onChangeText={(text) => {
                  setDueDate(text);
                  clearFieldError("dueDate");
                }}
                editable={!loading}
              />
              {dueDate && (
                <TouchableOpacity
                  onPress={() => {
                    setDueDate("");
                    clearFieldError("dueDate");
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            {errors.dueDate && (
              <Text style={styles.fieldError}>{errors.dueDate}</Text>
            )}
            <Text style={styles.hint}>
              Format: Année-Mois-Jour (2025-12-31)
            </Text>
          </View>

          {/* Aperçu */}
          {title && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Aperçu</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Ionicons name="ellipse-outline" size={24} color="#999" />
                  <Text style={styles.previewTaskTitle} numberOfLines={2}>
                    {selectedCategory.value
                      ? `${selectedCategory.value} - ${title}`
                      : title}
                  </Text>
                </View>
                {description && (
                  <Text style={styles.previewDescription} numberOfLines={2}>
                    {description}
                  </Text>
                )}
                {dueDate && !errors.dueDate && (
                  <View style={styles.previewDate}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.previewDateText}>
                      {new Date(dueDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                !canSubmit && styles.createButtonDisabled,
              ]}
              onPress={handleCreateTask}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.createButtonText}>Créer</Text>
                </>
              )}
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 10,
  },
  inputWrapperError: {
    borderColor: "#f44336",
    borderWidth: 2,
    backgroundColor: "#ffebee",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  fieldError: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginLeft: 4,
  },
  categoriesContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#0080C8",
    borderColor: "#0080C8",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  quickDateButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  quickDateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 6,
  },
  quickDateButtonText: {
    fontSize: 14,
    color: "#0080C8",
    fontWeight: "500",
  },
  previewSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  previewTaskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  previewDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 34,
    marginBottom: 8,
  },
  previewDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 34,
  },
  previewDateText: {
    fontSize: 12,
    color: "#666",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#0080C8",
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default AddTaskScreen;
