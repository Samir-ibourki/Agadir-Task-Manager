/* eslint-disable no-unused-vars */
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios.js";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // REGISTER

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // Save token + user
      await AsyncStorage.setItem("token", response.data.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.data));

      setUser(response.data.data);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Problème dans register";

      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      await AsyncStorage.setItem("token", response.data.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.data));

      setUser(response.data.data);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Problème dans login";

      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // CHECK AUTH

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userdata = await AsyncStorage.getItem("user");

      if (token && userdata) {
        setUser(JSON.parse(userdata));
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  // LOGOUT

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return {
    loading,
    error,
    user,
    register,
    login,
    checkAuth,
    logout,
  };
};

export default useAuth;
