// src/services/authService.js
import api from "./api"; // não use axios direto

export const register = async ({ cpf, dataNascimento, email }) => {
  const response = await api.post("/register", {
    cpf,
    dataNascimento,
    email,
  });
  return response.data;
};

export const login = async ({ userName, password }) => {
  const response = await api.post("/auth/login", {
    userName,
    password,
  });
  return response.data;
};