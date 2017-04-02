/**
 * Created by Ebates on 17/1/19.
 * AllCouponPageCategoryListContanier
 * 全部优惠页 的 Category 下拉 列表 数据源
 */

import React, {Component, PropTypes} from 'react';
import {
    View, Text, Animated
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BizMerchantListCell from '../../Comp/BizCells/BizMerchantListCell'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseListComp from '../../Comp/Base/BaseListComp'
import BizDropDownListComp from '../../Comp/BizList/BizDropDownListComp'
import *as AllCouponPageApi from '../../NetWork/API/AllCouponPageApi'


class AllCouponPageCategoryListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
        AnimatedViewStyle:PropTypes.any,//下拉列表的容器
        onPress:PropTypes.func,
        refreshListEventName: React.PropTypes.string,//主动调 某列表 控件的 刷新 逻辑 的 事件

    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentWillUnmount() {
        Log.log('AllCouponPageCategoryListContanier componentWillUnmount ')

        AllCouponPageApi.AllCouponPageCategoryListApi.isThisCompDidMount=false;
    }

    /**
     * @param props
     * @returns {XML}
     */
    // renderNetWorkAbnormalView(props) {
    //
    //     return BizViews.netWorkAbnormalView({}, {
    //         marginTop: 60,
    //         width: 90,
    //         height: 90,
    //     }, {marginTop: 25,}, {marginTop: 17}, () => {
    //         this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表
    //
    //     });
    // }

    render() {
        Log.log('AllCouponPageCategoryListContanier render() ')
        return (
            <BizDropDownListComp
                {...this.props}
                onPress={
                    ()=>{
                        this.props.onPress&&this.props.onPress()
                    }
                }
                renderNetWorkAbnormalView={(props) => {
                    return BizViews.netWorkAbnormalView({}, {
                        marginTop: 60,
                        width: 90,
                        height: 90,
                    }, {marginTop: 25,}, {marginTop: 17}, () => {
                        {/*this.props.dispatch(BizApi.SearchResultPageMerchantListAPI.fetchData(BaseListActions.BaseListFetchDataType.REFRESH, props.route.value));//刷新 列表*/
                        }

                    });
                }
                }
            />

        );
    }
}

function mapStateToProps(state) {
    const {AllCouponPageCategoryListReducer}=state;
    return {
        baseReducer: AllCouponPageCategoryListReducer,
    };

}

export default connect(mapStateToProps)(AllCouponPageCategoryListContanier);