import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_ROUTE}offercategories`;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const offerCategoryService = {
  getCategories: async (token) => {
    const response = await axios.get(API_URL, getAuthHeaders(token));
    return response.data;
  },
};

export default offerCategoryService;