/**
 * Created by Ebates on 17/1/19.
 * AllCoupontPageListContanier
 * 全部优惠页 的 优惠 列表 数据源
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizMerchantListCell from '../../Comp/BizCells/BizMerchantListCell'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseListComp from '../../Comp/Base/BaseListComp'
import MerchantListComp from '../../Comp/BizList/MerchantListComp'
import *as EventListener from '../../Utils/EventListener/EventListener'
// import SMSTimer from '../../Utils/SMSTimer'
import *as AllCouponPageApi from '../../NetWork/API/AllCouponPageApi'
import *as AllCouponsPage from '../../Pages/AllCouponsPage'


//事件驱动,主动刷新 全部优惠页 优惠 列表的事件名
export const AllCouponPageRefreshListEventName = 'AllCouponPageRefreshListEventName';


class AllCoupontPageListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    /**
     * @param props
     * @returns {XML}
     */
    renderNetWorkAbnormalView(props) {

        return BizViews.netWorkAbnormalView({}, {
            marginTop: 60,
            width: 90,
            height: 90,
        }, {marginTop: 25,}, {marginTop: 17}, () => {
            // this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表

        });
    }

    render() {

        const {dispatch}=this.props;
        return (
            <CouponListComp
                {...this.props}
                refreshListEventName={AllCouponPageRefreshListEventName}
                renderNoDataView={(props) => {
                    return BizViews.renderAllCouponPageNoDataView( () => {
                        {/*Log.log('AllMerchantPageListContanier  render 查看全部商家')*/}

                        dispatch(AllCouponPageApi.AllCouponPageListApi.resetAllDropDownListSelectedInfo())

                        EventListener.sendEvent(AllCouponsPage.AllCouponPageChangeTitleEventName,'全部优惠');
                        EventListener.sendEvent(AllCouponsPage.AllCouponPageChangeCategoryMenuTitleEventName,'分类');
                        {/*EventListener.sendEvent(AllMerchantPage.AllMerchantPageChangeCountryMenuTitleEventName,'国家');*/}
                        {/*EventListener.sendEvent(AllMerchantPage.AllMerchantPageChangeSortMenuTitleEventName,'排序');*/}


                        EventListener.sendEvent(AllCouponPageRefreshListEventName);
                    });
                }
                }
                renderNetWorkAbnormalView={(props) => {
                    return BizViews.netWorkAbnormalView({}, {
                        marginTop: 60,
                        width: 90,
                        height: 90,
                    }, {marginTop: 25,}, {marginTop: 17}, () => {
                        this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表

                    });

                }
                }
            />
        );
    }
}

function mapStateToProps(state) {
    const {AllCouponPageListReducer}=state;
    return {
        baseReducer: AllCouponPageListReducer,
    };

}

export default connect(mapStateToProps)(AllCoupontPageListContanier);