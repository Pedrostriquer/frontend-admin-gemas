import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_ROUTE}messages`;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const messageService = {
  getMessages: async (token) => {
    const response = await axios.get(API_URL, getAuthHeaders(token));
    return response.data;
  },

  createMessage: async (messageData, token) => {
    const response = await axios.post(API_URL, messageData, getAuthHeaders(token));
    return response.data;
  },

  deleteMessage: async (id, token) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders(token));
  },
};

export default messageService;