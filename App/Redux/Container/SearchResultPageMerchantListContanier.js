/**
 * Created by Ebates on 17/1/19.
 *
 * 搜索结果页 的 商家 列表 数据源
 */

import React from 'react';
import {connect} from 'react-redux';
import MerchantListComp from '../../Comp/BizList/MerchantListComp'

class SearchResultPageMerchantListContanier extends React.Component {

    render() {
        return (
            <MerchantListComp {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    //把 state里的 homePageReducer 注入到 HomePage.props里
    const {SearchResultPageMerchantListReducer}=state;
    return {
        baseReducer:SearchResultPageMerchantListReducer,
        tabLabel: SearchResultPageMerchantListReducer.tabLabel//.getIn(['state', 'tabLabel'])
    };

}

export default connect(mapStateToProps)(SearchResultPageMerchantListContanier);