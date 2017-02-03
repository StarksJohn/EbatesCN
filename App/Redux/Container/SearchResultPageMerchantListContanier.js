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
import Colors from '../../Utils/Colors'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'

class SearchResultPageMerchantListContanier extends React.Component {

    /**
     * 画 搜索结果页 的 商家列表的 无数据状态 view
     * @param props
     * @returns {XML}
     */
    renderNoDataView(props) {
        Log.log('MerchantListComp renderNoDataView props.route.value==' + props.route.value);

        // return (
        //     <View style={{flex: 1, backgroundColor: Colors.getRandomColor()}}>
        //
        //     </View>
        // );

        return BizViews.renderSearchResultPageNoDataView(props.route.value,0,()=>{

        });
    }

    render() {
        return (
            <MerchantListComp {...this.props}
                              renderNoDataView={(props) => {
                                  return this.renderNoDataView(props);
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