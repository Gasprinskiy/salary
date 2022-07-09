import { createRouter, createWebHistory } from 'vue-router'

import StartView from '../views/StartView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'
import RecordView from '../views/RecordView.vue'
import UserDataView from '../views/UserDataView.vue'
import CalculationsView from '../views/СalculationsView.vue'
import ArchiveView from '../views/ArchiveView.vue'

const routes = [
    {
        path: '/',
        component: StartView,
        meta: {
            index: 0,
            noNav: true,
        }
    },
    {
        path: '/register',
        component: RegisterView,
        meta: {
            index: 1,
            noNav: true,
        }
    },
    {
        path: '/main',
        component: MainView ,
        meta: {
            index: 2
        }
    },
    {
        path: '/user-data',
        component: UserDataView,
        meta: {
            index: 3
        }
        
    },
    {
        path: '/calculations',
        component: CalculationsView,
        meta: {
            index: 4
        }
    },
    {
        path: '/record/:period',
        component: RecordView,
        meta: {
            index: 5
        }
    },
    {
        path: '/arhive',
        component: ArchiveView,
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