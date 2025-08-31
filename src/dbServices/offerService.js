import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_ROUTE}offers`;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getAuthHeadersFormData = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

const offerService = {
  getOffers: async (token) => {
    const response = await axios.get(API_URL, getAuthHeaders(token));
    return response.data;
  },

  createOffer: async (offerData, token) => {
    const response = await axios.post(
      API_URL,
      offerData,
      getAuthHeaders(token)
    );
    return response.data;
  },

  updateOffer: async (id, offerData, token) => {
    const response = await axios.put(
      `${API_URL}/${id}`,
      offerData,
      getAuthHeaders(token)
    );
    return response.data;
  },

  deleteOffer: async (id, token) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders(token));
  },

  toggleOfferStatus: async (id, token) => {
    const response = await axios.patch(
      `${API_URL}/${id}/toggle-status`,
      {},
      getAuthHeaders(token)
    );
    return response.data;
  },

  uploadMidea: async (file, token) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_URL}/upload-midea`,
      formData,
      getAuthHeadersFormData(token)
    );
    return response.data;
  },

  deleteMidea: async (fileUrl, token) => {
    await axios.post(
      `${API_URL}/delete-midea`,
      { url: fileUrl },
      getAuthHeaders(token)
    );
  },
};

export default offerService;
