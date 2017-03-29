/**
 * Created by Ebates on 17/1/19.
 * AllMerchantPageSortListContanier
 * 全部商家页 的 排序 下拉 列表 数据源
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
import BaseListComp from '../../Comp/Base/BaseListComp'
import BizDropDownListComp from '../../Comp/BizList/BizDropDownListComp'


class AllMerchantPageSortListContanier extends Component {

    static propTypes = {
        // AllMerchantPageReducer:PropTypes.any ,//全部商家 页面的 reducer
        // AnimatedViewStyle:PropTypes.any,//下拉列表的容器
    };

    static defaultProps = {
        // AllMerchantPageReducer:null

    };

    componentWillUnmount() {
        Log.log('AllMerchantPageSortListContanier componentWillUnmount ')

        BizApi.AllMerchantPageSortDropDownListApi.isThisCompDidMount=false;

    }

    render() {
        Log.log('AllMerchantPageCountryListContanier render() ')
        return (
            <BizDropDownListComp
                {...this.props}

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
    const {AllMerchantPageSortListReducer}=state;
    return {
        baseReducer: AllMerchantPageSortListReducer,
    };

}

export default connect(mapStateToProps)(AllMerchantPageSortListContanier);