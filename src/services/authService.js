import api from './api';

export const login = async (email, senha) => {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
};

export const cadastro = async (nome, email, senha) => {
  const { data } = await api.post('/auth/cadastro', { nome, email, senha });
  return data;
};

export const saveUser = (userData) => {
  localStorage.setItem('praio_user', JSON.stringify(userData));
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem('praio_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('praio_user');
};
