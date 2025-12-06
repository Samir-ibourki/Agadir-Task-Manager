import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useTasks from "../hooks/useTasks.js";
import useAuth from "../hooks/useAuth.js";

const DashboardScreen = () => {
  const {
    loading,
    error,
    refreshing,
    deleteTask,
    markAsDone,
    onRefresh,
    getTasksByStatus,
    getStats,
  } = useTasks();

  const { user, logout } = useAuth();

  const [filterStatus, setFilterStatus] = useState("all");
  const stats = getStats();

  const filteredTasks = getTasksByStatus(filterStatus);
  const handleDeleteTask = (task) => {
    Alert.alert(
      "Supprimer la tâche",
      `Êtes-vous sûr de vouloir supprimer "${task.title}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTask(task.id);
            if (result.success) {
              Alert.alert("✅ Succès", "Tâche supprimée");
            } else {
              Alert.alert("❌ Erreur", result.error);
            }
          },
        },
      ]
    );
  };

  // Fonction: Marquer comme terminée

  const handleToggleTask = async (task) => {
    if (task.status === "done") {
      Alert.alert("Info", "Cette tâche est déjà terminée");
      return;
    }

    const result = await markAsDone(task.id);
    if (!result.success) {
      Alert.alert("❌ Erreur", result.error);
    }
  };

  // Fonction: Déconnexion

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("(auth)/login");
        },
      },
    ]);
  };

  // Composant: Carte de statistiques

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  // Composant: Bouton de filtre

  const FilterButton = ({ status, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Ionicons
        name={icon}
        size={18}
        color={filterStatus === status ? "#FFFFFF" : "#0080C8"}
      />
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Composant: Carte de tâche

  const TaskCard = ({ task }) => {
    const isDone = task.status === "done";

    return (
      <TouchableOpacity
        style={[styles.taskCard, isDone && styles.taskCardDone]}
        onPress={() => router.push(`/task/${task.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <TouchableOpacity
              onPress={() => handleToggleTask(task)}
              style={styles.checkboxContainer}
            >
              <Ionicons
                name={isDone ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isDone ? "#4caf50" : "#999"}
              />
            </TouchableOpacity>
            <Text
              style={[styles.taskTitle, isDone && styles.taskTitleDone]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteTask(task)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>

        {task.description && (
          <Text
            style={[
              styles.taskDescription,
              isDone && styles.taskDescriptionDone,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.taskFooter}>
          {task.due_date && (
            <View style={styles.taskDate}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.taskDateText}>
                {new Date(task.due_date).toLocaleDateString("fr-FR")}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.taskStatus,
              isDone ? styles.taskStatusDone : styles.taskStatusPending,
            ]}
          >
            <Text
              style={[
                styles.taskStatusText,
                isDone
                  ? styles.taskStatusTextDone
                  : styles.taskStatusTextPending,
              ]}
            >
              {isDone ? "Terminée" : "En attente"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="clipboard-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Aucune tâche</Text>
      <Text style={styles.emptyStateText}>
        {filterStatus === "all"
          ? "Commencez par ajouter votre première tâche"
          : filterStatus === "pending"
          ? "Aucune tâche en attente"
          : "Aucune tâche terminée"}
      </Text>
      {filterStatus === "all" && (
        <TouchableOpacity
          style={styles.addButtonEmpty}
          onPress={() => router.push("/add-task")}
        >
          <Text style={styles.addButtonEmptyText}>Ajouter une tâche</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0080C8" />

      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.username}>{user?.name || "Utilisateur"} 👋</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="list-outline"
          label="Total"
          value={stats.total}
          color="#2196f3"
        />
        <StatCard
          icon="time-outline"
          label="En attente"
          value={stats.pending}
          color="#ff9800"
        />
        <StatCard
          icon="checkmark-done-outline"
          label="Terminées"
          value={stats.done}
          color="#4caf50"
        />
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        <FilterButton status="all" label="Toutes" icon="list-outline" />
        <FilterButton status="pending" label="En attente" icon="time-outline" />
        <FilterButton
          status="done"
          label="Terminées"
          icon="checkmark-outline"
        />
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Liste des tâches */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0080C8" />
          <Text style={styles.loadingText}>Chargement des tâches...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0080C8"]}
              tintColor="#0080C8"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bouton flottant pour ajouter */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-task")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0080C8",
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#FFFFFF",
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 3,
    gap: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  filtersContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0080C8",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#0080C8",
    borderColor: "#0080C8",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0080C8",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  errorText: {
    flex: 1,
    color: "#f44336",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskCardDone: {
    opacity: 0.7,
    backgroundColor: "#f9f9f9",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  checkboxContainer: {
    padding: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    padding: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    marginLeft: 38,
  },
  taskDescriptionDone: {
    color: "#999",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 38,
  },
  taskDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskDateText: {
    fontSize: 12,
    color: "#666",
  },
  taskStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskStatusPending: {
    backgroundColor: "#fff3e0",
  },
  taskStatusDone: {
    backgroundColor: "#e8f5e9",
  },
  taskStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  taskStatusTextPending: {
    color: "#ff9800",
  },
  taskStatusTextDone: {
    color: "#4caf50",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  addButtonEmpty: {
    backgroundColor: "#0080C8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonEmptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0080C8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default DashboardScreen;
