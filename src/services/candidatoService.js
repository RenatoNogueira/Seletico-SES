import api from './api';

export const buscarCandidatoPorCPF = async (cpf) => {
  const response = await api.get(`/Candidato/${cpf}`);
  return response.data;
};