import request from "@/utils/request"
export const reqCategoryList1 = () => request({ url: `/admin/product/getCategory1`, method: 'get' })
export const reqCategoryList2 = (id) => request({ url: `/admin/product/getCategory2/${id}`, method: 'get' })
export const reqCategoryList3 = (id) => request({ url: `/admin/product/getCategory3/${id}`, method: 'get' })
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
export const reqAttrDelete = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
export const reqAttrSave = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })