import {createRouter, createWebHistory} from 'vue-router'
import Layout from '@/layout/index.vue'

export const routes = [
    {
        path: '',
        component: Layout,
        redirect: 'home',
        name: "Layout",
        children: [
            {
                name: '/home',
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页'
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import ('@/views/login/index.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
