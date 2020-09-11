import variables from '@/styles/element-variables.scss'

const {showSettings, tagsView, fixedHeader, sidebarLogo} =
    {
        showSettings: true, tagsView: true, fixedHeader: false, sidebarLogo: false
    }

const state = {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
}

const mutations = {
    CHANGE_SETTING: (state, {key, value}) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({commit}, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

