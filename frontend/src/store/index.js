import {createStore} from "vuex"
import axios from "axios"
import {UserRoles, UserStatus} from "../constants/user"

export default createStore({
    state: {
        user: null
    },
    getters: {
        isAdmin: state => state.user && state.user.roles.includes(UserRoles.Admin),
        isEditor: state => state.user && state.user.roles.includes(UserRoles.Editor),
        isEnabled: state => state.user && state.user.status === UserStatus.Enabled,
        username: state => state.user && state.user.username
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        }
    },
    actions: {
        async login({commit}, username) {
            const response = await axios.post(`/api/users/login/${username}`)
            commit('setUser', response.data)
            return response.data
        }
    }
})