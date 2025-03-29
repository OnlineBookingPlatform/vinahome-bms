import { defineNuxtPlugin } from "#app";
import { createPinia } from "pinia";
import { useAuthStore } from "~/stores/authStore";
import { useOfficeStore } from "~/stores/officeStore";


export default defineNuxtPlugin((nuxtApp) => {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia); 

    nuxtApp.provide("pinia", pinia);
  
    const authStore = useAuthStore(pinia);
    authStore.loadUser();
    const officeStore = useOfficeStore(pinia);
    officeStore.loadOffice();
});
