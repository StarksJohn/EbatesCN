/**
 * Created by Ebates on 2017/4/3.
 * PersonalPageApi
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
// import *as CouponDetailPageActions from '../../Redux/Actions/CouponDetailPageActions'
import *as RequestUtil from '../RequestUtil'
import *as TokenAPI from './TokenAPI'
import *as BizApi from './BizApi'
// import SMSTimer from '../../Utils/SMSTimer'

export const PersonalPageApi={
    ApiName:'PersonalPageApi',

    fetchPageList(opt,BaseListCompProps){
        return (dispatch) => {
            Log.log('PersonalPageApi fetchPageList opt==' +opt)

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: false,
                newContentArray: [{},{},{},{},{},{}],
            }));

        }
    }
};