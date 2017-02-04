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

class SearchResultPageCouponListContanier extends React.Component {

    /**
     * 画 搜索结果页 的 优惠 列表的 无数据状态 view
     * @param props
     * @returns {XML}
     */
    renderNoDataView(props) {

        return BizViews.renderSearchResultPageNoDataView(props.route.value,1,()=>{

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