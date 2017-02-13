/**
 * Created by Ebates on 17/1/19.
 *
 * 搜索结果页 的 优惠 列表 数据源
 */

import React from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
import CouponListComp from '../../Comp/BizList/CouponListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import *as BaseListActions from '../Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'

class SearchResultPageCouponListContanier extends React.Component {

    /**
     * 画 搜索结果页 的 优惠 列表的 无数据状态 view
     * @param props
     * @returns {XML}
     */
    renderNoDataView(props) {

        return BizViews.renderSearchResultPageNoDataView(props.route.value,1,()=>{
            // this.props.dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.REFRESH, BizApi.SearchResultPageCouponListAPI.ApiName));
            // this.props.dispatch(BizApi.SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(BaseListActions.BaseListFetchDataType.REFRESH, null,1 ));//刷新 列表
            // this.props.onResetSearchBar();

            //跳转到 全部优惠 页面

        });
    }

    render() {
        return (
            <CouponListComp {...this.props}
                              renderNoDataView={(props) => {
                                  return this.renderNoDataView(props);
                              }
                              }
            />
        );
    }
}

function mapStateToProps(state) {
    const {SearchResultPageCouponListReducer}=state;
    return {
        baseReducer: SearchResultPageCouponListReducer,
        tabLabel: SearchResultPageCouponListReducer.tabLabel
    };

}

export default connect(mapStateToProps)(SearchResultPageCouponListContanier);