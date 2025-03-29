import { defineStore } from "pinia";
import type { AuthStoreType } from "~/types/AuthType";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthStoreType | null,
  }),
  getters: {
    storeId: (state) => state.user?.id,
    storeNameUser: (state) => state.user?.name,
    storeRole: (state) => state.user?.role,
    storeToken: (state) => state.user?.token,
    storeCompanyId: (state) => state.user?.company_id,
    storeCodeCompany: (state) => state.user?.code,
  },
  actions: {
    setUser(userData: AuthStoreType) {
      this.user = userData;
      if (process.client) {
        localStorage.setItem("useAuthStore", JSON.stringify(userData));
      }
    },
    logout() {
        this.user = null;
        if (process.client) {
          localStorage.removeItem("useAuthStore");
        }
      },
    loadUser() {
      if (process.client) {
        const storedUser = localStorage.getItem("useAuthStore");
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }
      }
    },
  },
});
