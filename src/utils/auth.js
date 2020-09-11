import Cookies from 'js-cookie'
// import { onBehalfOf, refreshXAuthToken } from '../api/login'
import store from '@/store'
import {MessageBox} from 'element-ui'
import service from './request'

const TokenKey = 'x-auth-token'
const AuthExpire = 'x-auth-expire'
const RefreshKey = 'x-auth-refresh-token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getAuthExpire() {
    let expire = Cookies.get(AuthExpire)
    return new Date(expire * 1000)
}

export function refreshXAuthToken(refreshToken) {
    return service.request({
        url: '/refreshXAuthToken',
        method: 'get',
        headers: {
            'x-auth-refresh-token': refreshToken
        }
    })
}

export function refreshTokens() {
    const refreshToken = Cookies.get(RefreshKey)
    refreshXAuthToken(refreshToken).then((response) => {
        let refreshedToken = response.data
        if (refreshedToken != null) {
            store.dispatch('user/UpdateToken', refreshedToken)
            console.log('Token Refreshed')
            setTimeout(refreshTokens, calcTimeout())
        }
    }).catch((err) => {
        console.log(err)
        console.log('Refresh token failed!')
        logout()
    })
}

export function logout(silent) {
    if (silent) {
        store.dispatch('user/DestroyAuth').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
        })
    } else {
        store.dispatch('user/DestroyAuth').then(() => {
            MessageBox.alert('请重新登录', 'Authentication', {
                confirmButtonText: '重新登录',
                type: 'warning'
            }).then(() => {
                location.reload()
            }).catch(() => {
                location.reload()
            })
        })
    }
}


function calcTimeout() {
    let tokenExpiryDate = getAuthExpire()
    if (!tokenExpiryDate) {
        console.log('No token expiry date. user probably never logged in')
        logout()
    }
    console.log('Token Ok. Expiring at ' + tokenExpiryDate)
    const MS_PER_MINUTE = 60000
    let tenMinutesBeforeExpiry = new Date(tokenExpiryDate.getTime() - 10 * MS_PER_MINUTE)
    const now = new Date()
    const millSeconds = tenMinutesBeforeExpiry.getTime() - now.getTime()
    console.log('Refresh token in: ' + millSeconds / 1000)
    return millSeconds
}

export function initSession() {
    return new Promise((resolve) => {
        setTimeout(refreshTokens, calcTimeout())
        console.log(resolve)
    })
}
