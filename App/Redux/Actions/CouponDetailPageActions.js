/**
 * Created by Ebates on 2017/4/6.
 * CouponDetailPageActions.js
 */

//成功拿到 优惠详情 接口返回的 数据
export const FetchPageDataSuccess='FetchPageDataSuccess';
export function FetchPageDataSuccessAction(pageData,ApiName) {
    return {type:FetchPageDataSuccess,pageData,ApiName}
}

