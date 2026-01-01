import api from "./api";

export const fetchClient = async (data) =>{
    return await api.get('/admin/clients',data);
}

export const createClient = async(data)=>{
    return await api.post('/admin/client/create',data)
}
export const fetchClientById = async(id,data)=>{
    return await api.get(`/admin/client/${id}`,data)
}

export const updateClient = async (id, data) => {
  return await api.put(`/admin/client/${id}`, data);
};
