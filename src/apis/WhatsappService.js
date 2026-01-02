import wa_api from "./WhatsappApi";

export const sessionCreate = (data) => {
  // data = { identifier, pin }
  return wa_api.post("/session", data);
};

export const getQR = (token) => {
  return wa_api.get(`/session/${token}/qr`);
};
export const sendMessage = (data) => {
  // data = { token, number, message }
  return wa_api.post("/message", data);
};

export const sendBulkMessage = (formData) => {
  // formData = token, numbers, message, image(optional)
  return wa_api.post("/bulk-message", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProfile = (token) => {
  return wa_api.get(`/profile/${token}`);
};

export const getContacts = (token) => {
  return wa_api.get(`/contacts/${token}`);
};

export const logoutSession = (token) => {
  return wa_api.post("/api/logout", { token });
};

export const getGroups = (token) => {
  return wa_api.get(`/groups/${token}`);
};

export const sendGroupMessage = (data) => {
  // data = { token, groupId, message }
  return wa_api.post("/send-group-message", data);
};

export const sendBulkGroupMessage = (data) => {
  // data = { token, groupIds, message, delay }
  return wa_api.post("/group-bulk-message", data);
};

export const downloadGroupParticipants = (token, groupId) => {
  return wa_api.get(`/groups/${token}/${groupId}/participants`, {
    responseType: "blob",
  });
};
