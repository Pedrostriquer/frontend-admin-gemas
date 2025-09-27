import api from "./api/api";

const offerCategoryService = {
  getCategories: async () => {
    const response = await api.get("offercategories");
    return response.data;
  },
};

export default offerCategoryService;
