import request from '@/utils/request'

export function getProductCatesWithChildren() {
    return request({
        url: '/productCategory/list/withChildren',
        method: 'get'
    })
}
