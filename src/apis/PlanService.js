import api from "./api";

export const fetchPlan = async(data)=>{
    return api.get('/plans',data);
};

export const  createPlan = async(data)=>{
    return api.post('/plan/create',data)
}

export const planById = async(id)=>{
    return api.get(`/plan/details/${id}`)
}
export const UpdatePlan = async(id,data)=>{
    return api.put(`/plan/${id}`,data)
}