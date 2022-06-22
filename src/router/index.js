import { createRouter, createWebHistory } from 'vue-router'

import Start from '../views/Start.vue'
import Main from '../views/Main.vue'
import Record from '../views/Record.vue'
import UserData from '../views/UserData.vue'
import Calculations from '../views/Сalculations.vue'
import Archive from '../views/Archive.vue'

const routes = [
    {
        path: '/',
        component: Start,
        meta: {
            index: 0,
            noNav: true,
        }
    },
    {
        path: '/register',
        component: UserData,
        meta: {
            index: 1,
            noNav: true,
        }
    },
    {
        path: '/main',
        component: Main,
        meta: {
            index: 2
        }
    },
    {
        path: '/user-data',
        component: UserData,
        meta: {
            index: 3
        }
        
    },
    {
        path: '/calculations',
        component: Calculations,
        meta: {
            index: 4
        }
    },
    {
        path: '/record/:period',
        component: Record,
        meta: {
            index: 5
        }
    },
    {
        path: '/arhive',
        component: Archive,
        meta: {
            index: 6
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router