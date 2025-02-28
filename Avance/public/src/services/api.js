import axios from 'axios';

const BASE_URL = "http://localhost:3000/api/auth"; 

const api = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { username, password });
      localStorage.setItem("token", response.data.token); //Se guarda el token en localstorage
      localStorage.setItem("userId", response.data.userId); // Se guarda el userId en localstorage
      localStorage.setItem("userRole", response.data.role);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  register: async (username, password, role) => { //se completa la funcion register.
    try {
      const response = await axios.post(`${BASE_URL}/register`, { username, password, role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default api;
