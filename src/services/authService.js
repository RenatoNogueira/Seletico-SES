
import api from './api'

export const login = async ({ userName, password }) => {
  const response = await api.post('/login', {
    userName,
    password,
  })
  return response.data
}

export const register = async ({ cpf, dataNascimento, email }) => {
  const response = await api.post('/register', {
    cpf,
    dataNascimento,
    email,
  })
  return response.data
}