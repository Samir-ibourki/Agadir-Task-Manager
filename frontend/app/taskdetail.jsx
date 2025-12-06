import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import useTasks from "../hooks/useTasks";

const TaskDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { tasks, updateTask, deleteTask, markAsDone, loading } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const task = tasks.find((t) => t.id === parseInt(id));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    }
  }, [task]);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={styles.errorStateTitle}>Tâche introuvable</Text>
          <Text style={styles.errorStateText}>
            Cette tâche n&apos;existe plus ou a été supprimée
          </Text>
          <TouchableOpacity
            style={styles.backButtonError}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonErrorText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (title.trim().length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        newErrors.dueDate = "Format de date invalide (YYYY-MM-DD)";
      } else {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
          newErrors.dueDate = "Date invalide";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
    };

    const result = await updateTask(task.id, taskData);

    if (result.success) {
      setIsEditing(false);
      Alert.alert("✅ Succès", "La tâche a été mise à jour");
    } else {
      Alert.alert("❌ Erreur", result.error);
    }
  };

  const handleCancel = () => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    setErrors({});
    setIsEditing(false);
  };

  const handleMarkAsDone = async () => {
    if (task.status === "done") {
      Alert.alert("Info", "Cette tâche est déjà terminée");
      return;
    }

    Alert.alert(
      "Marquer comme terminée",
      `Voulez-vous marquer "${task.title}" comme terminée ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            const result = await markAsDone(task.id);
            if (result.success) {
              Alert.alert("✅ Succès", "Tâche terminée !");
            } else {
              Alert.alert("❌ Erreur", result.error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "⚠️ Supprimer la tâche",
      `Êtes-vous sûr de vouloir supprimer "${task.title}" ?\n\nCette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTask(task.id);
            if (result.success) {
              Alert.alert("✅ Succès", "Tâche supprimée", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } else {
              Alert.alert("❌ Erreur", result.error);
            }
          },
        },
      ]
    );
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

  const isDone = task.status === "done";

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
        <Text style={styles.headerTitle}>Détails de la tâche</Text>
        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#0080C8" />
          </TouchableOpacity>
        )}
        {isEditing && <View style={{ width: 40 }} />}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge de statut */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              isDone ? styles.statusBadgeDone : styles.statusBadgePending,
            ]}
          >
            <Ionicons
              name={isDone ? "checkmark-circle" : "time-outline"}
              size={20}
              color={isDone ? "#4caf50" : "#ff9800"}
            />
            <Text
              style={[
                styles.statusText,
                isDone ? styles.statusTextDone : styles.statusTextPending,
              ]}
            >
              {isDone ? "Terminée" : "En attente"}
            </Text>
          </View>

          {/* Date de création */}
          <View style={styles.createdAt}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.createdAtText}>
              Créée le {new Date(task.created_at).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>

        {/* Titre */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Titre <Text style={styles.required}>*</Text>
          </Text>
          {isEditing ? (
            <>
              <View
                style={[
                  styles.inputWrapper,
                  errors.title && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
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
            </>
          ) : (
            <Text
              style={[styles.displayText, isDone && styles.displayTextDone]}
            >
              {task.title}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          {isEditing ? (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Ajoutez des détails..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>
          ) : (
            <Text
              style={[
                styles.displayText,
                !task.description && styles.displayTextEmpty,
                isDone && styles.displayTextDone,
              ]}
            >
              {task.description || "Aucune description"}
            </Text>
          )}
        </View>

        {/* Date d'échéance */}
        <View style={styles.section}>
          <Text style={styles.label}>Date d&apos;échéance</Text>
          {isEditing ? (
            <>
              <View
                style={[
                  styles.inputWrapper,
                  errors.dueDate && styles.inputWrapperError,
                ]}
              >
                <Ionicons name="calendar-outline" size={20} color="#0080C8" />
                <TextInput
                  style={styles.input}
                  value={dueDate}
                  onChangeText={(text) => {
                    setDueDate(text);
                    clearFieldError("dueDate");
                  }}
                  placeholder="YYYY-MM-DD"
                  editable={!loading}
                />
              </View>
              {errors.dueDate && (
                <Text style={styles.fieldError}>{errors.dueDate}</Text>
              )}
            </>
          ) : (
            <View style={styles.displayDate}>
              <Ionicons name="calendar-outline" size={20} color="#0080C8" />
              <Text style={styles.displayText}>
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Aucune date définie"}
              </Text>
            </View>
          )}
        </View>

        {/* Boutons d'action en mode édition */}
        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Boutons d'action en mode lecture */}
        {!isEditing && (
          <View style={styles.actionsSection}>
            {!isDone && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleMarkAsDone}
                disabled={loading}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#4caf50"
                />
                <Text style={[styles.actionButtonText, { color: "#4caf50" }]}>
                  Marquer comme terminée
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Ionicons name="trash-outline" size={24} color="#f44336" />
              <Text style={[styles.actionButtonText, { color: "#f44336" }]}>
                Supprimer la tâche
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  editButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 12,
  },
  statusBadgePending: {
    backgroundColor: "#fff3e0",
  },
  statusBadgeDone: {
    backgroundColor: "#e8f5e9",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusTextPending: {
    color: "#ff9800",
  },
  statusTextDone: {
    color: "#4caf50",
  },
  createdAt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createdAtText: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    marginBottom: 24,
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
  displayText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  displayTextEmpty: {
    color: "#999",
    fontStyle: "italic",
  },
  displayTextDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  displayDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editActions: {
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
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#0080C8",
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionsSection: {
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    gap: 12,
  },
  deleteActionButton: {
    backgroundColor: "#ffebee",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  errorStateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  backButtonError: {
    backgroundColor: "#0080C8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonErrorText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskDetailScreen;
