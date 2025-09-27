import api from "./api/api";

const offerService = {
  getOffers: async () => {
    const response = await api.get("offers");
    return response.data;
  },

  createOffer: async (offerData) => {
    const response = await api.post("offers", offerData);
    return response.data;
  },

  updateOffer: async (id, offerData) => {
    const response = await api.put(`offers/${id}`, offerData);
    return response.data;
  },

  deleteOffer: async (id) => {
    await api.delete(`offers/${id}`);
  },

  toggleOfferStatus: async (id) => {
    const response = await api.patch(`offers/${id}/toggle-status`, {});
    return response.data;
  },

  uploadMidea: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("offers/upload-midea", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteMidea: async (fileUrl) => {
    await api.post("offers/delete-midea", { url: fileUrl });
  },
};

export default offerService;
