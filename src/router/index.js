import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)
/* Layout */

export const constantRouterMap = [
    {
        path: '/admin/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        name: '登录界面',
        title: 'aaaa'
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/home/index'),
                meta: {title: '首页', icon: 'home'}
            }
        ]
    }
]

export const asyncRouterMap = [
    {
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: {title: '商品', icon: 'product', roles: ['pms_admin', 'test']},
        children: [
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/pms/product/index'),
                meta: {title: '商品列表', icon: 'product-list', roles: ['test']}
            },
            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/pms/brand/index'),
                meta: {title: '品牌管理', icon: 'product-brand', roles: ['pms_admin']}
            }]
    }]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router


