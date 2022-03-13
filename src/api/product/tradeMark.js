import request from "@/utils/request";

export const reqTradeMarkList = (page, limit) => request({
  url: `admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

//添加品牌\修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {//修改
    return request({url: 'admin/product/baseTrademark/update', method: 'post', data: tradeMark})
  } else {//添加
    return request({url: 'admin/product/baseTrademark/save', method: 'put', data: tradeMark})
  }
}

//删除品牌
export const reqDeleteTradeMark = (id) => request({url: `admin/product/baseTrademark/remove/${id}`, method: 'delete'})
