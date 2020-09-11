import request from '@/utils/request'

export function getProducts(params) {
    return request({
        url: '/product/wx/list',
        method: 'get',
        params: params
    })
}

export function createProduct(data) {
    return request({
        url: '/product/create',
        method: 'post',
        data: data
    })
}

export function updateProduct(id, data) {
    return request({
        url: '/product/update/' + id,
        method: 'post',
        data: data
    })
}

export function getProduct(id) {
    return request({
        url: '/product/updateInfo/' + id,
        method: 'get',
    })
}
