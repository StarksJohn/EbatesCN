/**
 搜索页的 列表
 */

import React, {Component} from 'react';
import {
    View,Text
} from 'react-native';
import {connect} from 'react-redux';
// import RecommendedFoodListCellContainer from '../../containers/RecommendedFoodListCellContainer'
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import *as BizViews from '../BizCommonComp/BizViews'


class SearchPageListComp extends Component {

    constructor(props) {
        super(props);

    }

    /**
     * 当前控件的cell的自定义绘制
     * @param rowData
     * @param sectionID
     * @param rowID
     * @param highlightRow
     * @returns {XML}
     */
    renderRow = (rowData, sectionID, rowID, highlightRow)=> {
        // <RecommendedFoodListCellContainer
        //     ApiName={this.props.ApiName}
        //     rowData={rowData}
        //     navigator={this.props.navigator}
        // />

        //最底部画 占位view
        if (rowID==this.props.baseReducer.dataArray.length-1){
            return BizViews.renderBottomTabbarBackView();
        }


        switch (rowID) {
            case '0': {
                return (
                    <View style={{height: 205,
                    //    backgroundColor: Colors.getRandomColor()
                    }}>
                        {BizViews.renderShadowLine()}
                        <Text style={{
                            color: 'rgba(64, 64, 64, 1)',
                            fontSize: 14, marginLeft: 15, marginTop: 25,
                            backgroundColor: Colors.getRandomColor()
                        }}>
                            热门搜索
                        </Text>
                    </View>

                )
            }
                break;
        }
        return (null);

    }

    render() {
        return ( <
                BaseListComp
                {...this.props }
                renderRow={
                    this.renderRow
                }

            />
        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SearchPageListReducer}=state;
    // let newProps={...SearchPageListReducer};
    return {baseReducer:SearchPageListReducer};
}

export default connect(mapStateToProps)(SearchPageListComp);