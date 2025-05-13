import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("@/views/pages/Crud.vue"),
        },
        {
            path: "/edit",
            component: () => import("@/views/uikit/FormLayout.vue"),
        },
        {
            path: "/login",
            component: () => import("@/views/pages/auth/Login.vue"),
        }
    ],
});
export default router;
//# sourceMappingURL=index.js.map