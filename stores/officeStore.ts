import { defineStore } from "pinia";

export const useOfficeStore = defineStore("office", {
  state: () => ({
    office: null as number | null,
  }),
  actions: {
    setOffice(officeData: number) {
      this.office = officeData;
      if (process.client) {
        localStorage.setItem("useOfficeStore", JSON.stringify(officeData));
      }
    },
    resetOffice() {
      this.office = null;
      if (process.client) {
        localStorage.removeItem("useOfficeStore");
      }
    },
    loadOffice() {
      if (process.client) {
        const storedOffice = localStorage.getItem("useOfficeStore");
        if (storedOffice) {
          this.office = JSON.parse(storedOffice);
        }
      }
    },
  },
});
