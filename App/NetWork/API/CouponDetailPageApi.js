/**
 * Created by Ebates on 2017/4/3.
 * CouponDetailPageApi
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'

export const CouponDetailPageApi={
    ApiName:'CouponDetailPageApi',

    fetchPageList(opt,BaseListCompProps){
        return (dispatch) => {
            Log.log('CouponDetailPageApi fetchPageList opt==' +opt)
            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: false,
                newContentArray: [{}],
            }));
        }
    }
};