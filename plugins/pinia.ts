import { defineNuxtPlugin } from "#app";
import { createPinia } from "pinia";
import { useAuthStore } from "~/stores/authStore";


export default defineNuxtPlugin((nuxtApp) => {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia); // ✅ Cài đặt Pinia trước
  
    // ✅ Gán Pinia vào `nuxtApp` trước khi gọi store
    nuxtApp.provide("pinia", pinia);
  
    // ✅ Chỉ gọi `useAuthStore()` sau khi Pinia đã được cài đặt
    const authStore = useAuthStore(pinia);
    authStore.loadUser();
});
