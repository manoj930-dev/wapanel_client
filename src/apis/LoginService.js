import api from "./api";

export const loginAdmin = async (data)=>{
    return await api.post('/admin/login',data)
}