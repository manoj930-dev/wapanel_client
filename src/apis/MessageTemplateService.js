import api from "./api";

export const fetchTemplate = async () => {
  return await api.get(`/template/list`);
};

export const addTemplate = async (data) => {
  return await api.post(`/template/create`, data);
};

export const updateTemplate = async (id, data) => {
  return await api.put(`/template/update/${id}`, data);
};
