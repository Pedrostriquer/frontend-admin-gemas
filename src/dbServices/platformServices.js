import api from "./api/api";

const platformServices = {
  getDashboardData: async () => {
    try {
      const response = await api.get("platformadminconfig");
      return response.data;
    } catch (error) {
      console.error("Error fetching sidebar config:", error);
      throw error;
    }
  },
  updateSidebarItemState: async (itemName, avaliable) => {
    try {
      const response = await api.patch(
        `platformconfig/sidebar/${encodeURIComponent(itemName)}`,
        { avaliable }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sidebar item:", error);
      throw error;
    }
  },
};

export default platformServices;