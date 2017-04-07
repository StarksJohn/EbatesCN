/**
 * Created by Ebates on 2017/4/3.
 * CouponDetailPageApi
 */
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as CouponDetailPageActions from '../../Redux/Actions/CouponDetailPageActions'
import *as RequestUtil from '../RequestUtil'
import *as TokenAPI from './TokenAPI'
import *as BizApi from './BizApi'
import SMSTimer from '../../Utils/SMSTimer'

export const CouponDetailPageApi={
    ApiName:'CouponDetailPageApi',

    fetchPageList(opt,BaseListCompProps){
        return (dispatch) => {
            Log.log('CouponDetailPageApi fetchPageList opt==' +opt)
            Log.log('CouponDetailPageApi fetchPageList BaseListCompProps.route.pageData=='+ Log.log(BaseListCompProps.route.pageData))

            dispatch(BaseListActions.SuccessFetchinglist(opt, this.ApiName, {
                couldLoadMore: false,
                newContentArray: [{},{},{},{},{}],
            }));

            let pageData=BaseListCompProps.route.pageData;

            // new SMSTimer({
            //     timerNums: 3,
            //     callBack: (time) => {
            //         Log.log('time===' + time);
            //         if (time == -1) {
            //
            //         }
            //     }
            // }).start();

            TokenAPI.checkAvailableMemoryTokenExpiresWhenUseApi().then(
                () => {
                    let url = RequestUtil.getStagingOrProductionHost() + 'coupons/'+pageData.id;
                    RequestUtil.GET(url, {
                            include: 'merchant'
                        },
                        (header) => {
                            BizApi.commonApiHeaderAppend(header)
                        },
                    ).then((responseData) => {

                        Log.log('CouponDetailPageApi fetchPageList 优惠详情 接口OK, responseData =' + Log.writeObjToJson(responseData));

                        // responseData.code='dddddd';//模拟有 优惠码数据

                        dispatch(CouponDetailPageActions.FetchPageDataSuccessAction(responseData,this.ApiName));
                        dispatch(BaseListActions.SuccessFetchinglist(BaseListActions.BaseListFetchDataType.REFRESH, this.ApiName, {
                            couldLoadMore: false,
                            newContentArray: [{},{},{},{},{}],
                        }));

                    }).catch((error) => {
                        Log.log('CouponDetailPageApi fetchPageList 优惠详情 接口失败 =' + error)
                        RequestUtil.showErrorMsg(error)

                    });
                });

        }
    }
};

//优惠详情页 弹出层modal的api
export const CouponDetailPageModalApi={
    ApiName:'CouponDetailPageModalApi'
}