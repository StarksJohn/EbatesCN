/**
 搜索页的 列表
 */

import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import {connect} from 'react-redux';
// import RecommendedFoodListCellContainer from '../../containers/RecommendedFoodListCellContainer'
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';


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

        switch (rowID) {
            case '0': {
                return (
                    <View style={{flex: 1, height: 1000, backgroundColor: Colors.getRandomColor()}}>

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