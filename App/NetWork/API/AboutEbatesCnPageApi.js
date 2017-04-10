/**
 * Created by Ebates on 2017/4/3.
 * AboutEbatesCnPageApi
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as RequestUtil from '../RequestUtil'
import *as TokenAPI from './TokenAPI'
import *as BizApi from './BizApi'

export const AboutEbatesCnPageApi={
    ApiName:'AboutEbatesCnPageApi',

    fetchPageList(opt,BaseListCompProps){
        return (dispatch) => {
            Log.log('AboutEbatesCnPageApi fetchPageList opt==' +opt)

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: false,
                newContentArray: [{},],
            }));

        }
    },


};