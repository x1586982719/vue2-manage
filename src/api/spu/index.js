import request from "@/utils/request"
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, params: { category3Id }, method: 'get' })
export const reqSpuSave = (data) => request({ url: `/admin/product/saveSpuInfo`, data, method: 'post' })
export const reqTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
export const reqAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })
export const reqSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
export const reqSpuImgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
export const reqUpdateOrSaveSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
    } else {
        return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
    }
}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
export const reqAttrInfoList = ({ category1Id, category2Id, category3Id }) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'
})
//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuForm) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuForm });
