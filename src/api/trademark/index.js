import request from "@/utils/request"
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
//品牌列表信息
export const reqTradeMarkUpdate = (trademark) => {
    if (trademark.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: trademark })
        //修改品牌
    } else {
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: trademark })
        //添加品牌
    }
}
export const reqTradeMarkDelete = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
