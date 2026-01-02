import api from "./api";

// GET ALL GROUPS
export const fetchGroups = () => {
  return api.get("/groups/list");
};

// CREATE GROUP
export const createGroup = (data) => {
  return api.post("/group/create", data);
};

// GET GROUP BY ID
export const fetchGroupById = (id) => {
  return api.get(`/group/${id}`);
};

// UPDATE GROUP
export const updateGroup = (id, data) => {
  return api.put(`/group/update/${id}`, data);
};

// DELETE GROUP
export const deleteGroup = (id) => {
  return api.delete(`/group/delete/${id}`);
};
export const numberAddInGroup = (data) => {
  return api.post(`/group/add/number`,data);
};
export const numberUpdateInGroup = (id,data) => {
  return api.put(`/group/number/${id}`,data);
};
export const numberDeleteInGroup = (id) => {
  return api.delete(`/group/number/${id}`);
};
