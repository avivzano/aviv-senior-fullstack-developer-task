import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import AdminView from '../views/AdminView.vue'
import EditorView from '../views/EditorView.vue'
import Login from '../views/Login.vue'
import store from '../store'
import {UserRoles, UserStatus} from '../constants/user'

const routes = [
    {path: '/', name: 'Login', component: Login},
    {path: '/home', name: 'Home', component: Home},
    {
        path: '/editor',
        name: 'Editor',
        component: EditorView,
        meta: {requiresEditor: true}
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
        meta: {requiresAdmin: true}
    },
    {path: '/:pathMatch(.*)*', redirect: '/'}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = store.state.user

    if (to.path === '/') return next()

    if (!user || user.status !== UserStatus.Enabled) {
        return next('/')
    }

    if (to.meta.requiresAdmin) {
        return user.roles.includes(UserRoles.Admin) ? next() : next('/home')
    }

    if (to.meta.requiresEditor) {
        return (user.roles.includes(UserRoles.Editor))
            ? next()
            : next('/home')
    }

    return next()
})

export default router
