import request from '@/utils/request'

export function getSkuStocks(pid, params) {
    return request({
        url: '/sku/' + pid,
        method: 'get',
        params: params
    })
}

export function updateSkuStock(pid, data) {
    return request({
        url: '/sku/update/' + pid,
        method: 'post',
        data: data
    })
}
