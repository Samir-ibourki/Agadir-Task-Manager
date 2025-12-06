import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_url = "http://10.0.2.2:3030";

const API = axios.create({
  baseURL: API_url,
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
