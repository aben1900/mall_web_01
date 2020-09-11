import {getInfo, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    Login({commit}, userInfo) {
        const {username, password} = userInfo
        return new Promise((resolve, reject) => {
            login({username: username.trim(), password: password}).then(response => {
                const {data} = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                console.log('得到token: ' + getToken())
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    GetInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const {data} = response
                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                const {roles, username, icon, introduction} = data

                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                commit('SET_ROLES', roles)
                commit('SET_NAME', username)
                commit('SET_AVATAR', icon)
                commit('SET_INTRODUCTION', introduction)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    Logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()
                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, {root: true})
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 销毁===注意与logout区别?一样的好像
    destroyAuth({commit, state}) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_USER', null)
                removeToken()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    ResetToken({commit}) {
        return new Promise(resolve => {
            console.log('aaabbb resetToken')
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    async ChangeRoles({commit, dispatch}, role) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)
        console.log('settoken......')
        const {roles} = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/GenerateRoutes', roles, {root: true})
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, {root: true})
    },

    UpdateToken({commit}, token) {
        setToken(token)
        commit('SET_TOKEN', token)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
