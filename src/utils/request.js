import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'

axios.defaults.withCredentials = true
// import store from '../store'

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    baseURL: 'http://localhost:8080', // api的base_url
    timeout: 15000, // 请求超时时间
    widthCredentials: true
})

service.interceptors.request.use(config => {
    if (!navigator.cookieEnabled) {
        // const token = store.getters['user/token']// only send token in header if cookie is not supported暂时不做
        // if (token) {
        //     config.headers['x-auth-token'] = token // request token header
        // }
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    let msg = error.message
    if (error.response && error.response.data && typeof error.response.data === 'string') {
        msg = msg + ': ' + error.response.data
    } else if (error.response && error.response.data) {
        console.log(error.response.data)
    }
    Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
    })
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            })

            // 401:未登录;
            if (res.code === 401) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
