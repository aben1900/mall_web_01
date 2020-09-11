import router from './index'
import store from '@/store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/admin/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    // set page title
    if (!document.title)
        document.title = to.meta.title
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/admin/login') {
            // if is logged in, redirect to the home page
            next({path: '/'})
            NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    let admininfo = await store.dispatch('user/GetInfo')
                    // generate accessible routes map based on roles
                    const accessRoutes = await store.dispatch('permission/GenerateRoutes', admininfo.roles)

                    // dynamically add accessible routes
                    router.addRoutes(accessRoutes)

                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({...to, replace: true})
                } catch (err) {
                    console.log(err)
                    console.log('user/GetInfo或permission/GenerateRoutes出错,token清空!')
                    // remove token and go to login page to re-login
                    await store.dispatch('user/ResetToken')
                    Message.error(err || 'Has Error')
                    next(`/admin/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/
        console.log('aaaabbbb has no token')
        console.log(to.path)
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/admin/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
