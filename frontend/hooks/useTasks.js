// src/hooks/useTasks.js
import { useState, useEffect } from "react";
import api from "../api/axios";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/tasks");

      setTasks(response.data.data);

      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "wrong in collecte task";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // create new task
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/tasks", taskData);

      setTasks((prevTasks) => [response.data.data, ...prevTasks]);

      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "probleme in create task";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/tasks/${taskId}`, taskData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? response.data.data : task
        )
      );

      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Wrong in refresh task";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete task

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);

      await api.delete(`/tasks/${taskId}`);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Wrong in delete task";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (taskId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/tasks/${taskId}/done`);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? response.data.data : task
        )
      );

      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Wrong in refresh";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Pull to Refresh

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasksByStatus = (status) => {
    if (status === "all") return tasks;
    return tasks.filter((task) => task.status === status);
  };

  const getStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  };

  return {
    //
    tasks,
    loading,
    error,
    refreshing,

    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markAsDone,

    onRefresh,
    getTasksByStatus,
    getStats,
  };
};

export default useTasks;
