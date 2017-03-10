/**
 * Created by Ebates on 17/1/19.
 *
 * 搜索结果页 的 商家 列表 数据源
 */

import React from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
import MerchantListComp from '../../Comp/BizList/MerchantListComp'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
// import *as SearchResultPageActions from '../Actions/SearchResultPageActions'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseListActions from '../Actions/BaseListActions'

class SearchResultPageMerchantListContanier extends React.Component {

    /**
     * 画 搜索结果页 的 商家列表的 无数据状态 view
     * @param props
     * @returns {XML}
     */
    renderNoDataView(props) {

        return BizViews.renderSearchResultPageNoDataView(props.route.value, 0, () => {
            // this.props.dispatch(BaseListActions.Loadinglist(BaseListActions.BaseListFetchDataType.REFRESH, BizApi.SearchResultPageMerchantListAPI.ApiName));
            // this.props.dispatch(BizApi.SearchResultPageSearchKeyWordAPI.searchKeyWordAPI(BaseListActions.BaseListFetchDataType.REFRESH, null,0 ));//刷新 列表

            // this.props.onResetSearchBar();

            //跳转到 全部商家 页面
        });
    }

    render() {
        return (
            <MerchantListComp {...this.props}
                              renderNoDataView={(props) => {
                                  return this.renderNoDataView(props);
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
    //把 state里的 homePageReducer 注入到 HomePage.props里
    const {SearchResultPageMerchantListReducer}=state;
    return {
        baseReducer: SearchResultPageMerchantListReducer,
        tabLabel: SearchResultPageMerchantListReducer.tabLabel//.getIn(['state', 'tabLabel'])
    };

}

export default connect(mapStateToProps)(SearchResultPageMerchantListContanier);