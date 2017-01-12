/**
 搜索页的 列表
 */

import React, {Component} from 'react';
import {
    View, Text
} from 'react-native';
import {connect} from 'react-redux';
// import RecommendedFoodListCellContainer from '../../containers/RecommendedFoodListCellContainer'
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import *as BizViews from '../BizCommonComp/BizViews'
import BaseTitleBt from '../Base/BaseTitleBt'
import *as GlobalStyles from '../../Global/GlobalStyles'
import BaseGridView from '../Base/BaseGridView'

class SearchPageListComp extends Component {

    constructor(props) {
        super(props);
    }

    onPress(model) {
        BizShowToast(model.title);
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
        if (rowID == this.props.baseReducer.dataArray.length - 1) {
            return BizViews.renderBottomTabbarBackView();
        }


        switch (rowID) {
            case '0': {
                let arr=[{title: '1'}, {title: '2'}, {title: '22222333'}, {title: '4'}, {title: '5'}, {title: '6'}, {title: '332323233232323'}, {title: '332323233232323'}, {title: '332323233232323'}];
                return (
                    <View style={{
                        height: 205,
                        //    backgroundColor: Colors.getRandomColor()
                    }}>
                        {BizViews.renderShadowLine()}
                        <Text style={{
                            color: 'rgba(64, 64, 64, 1)',
                            fontSize: 14, marginLeft: 15, marginTop: 20,
                            backgroundColor: Colors.getRandomColor()
                        }}>
                            热门搜索
                        </Text>
                        <BaseGridView
                            items={Array.from(arr)}//数组元素是 {id:'',name:''}
                            containerStyle={{paddingLeft: 10,
                                paddingRight: 10, paddingTop: 10,paddingBottom: 10,
                                backgroundColor:Colors.getRandomColor()
                            }}
                            renderItem={(model)=>{
                                return (
                                    <BaseTitleBt
                                        btStyle={[{
                                            width: (GlobalStyles.window.width - 30 - 20) / 3,
                                            borderRadius: 4, margin: 5, height: 45,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: Colors.getRandomColor(),
                                        }]}
                                        onPress={() => this.onPress(model)}
                                        textStyle={{
                                            fontSize: 15,
                                            color: Colors.black,
                                        }}
                                        title={model.title}
                                        disabled={false}
                                    >
                                    </BaseTitleBt>
                                );
                            }}
                        />
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
    return {baseReducer: SearchPageListReducer};
}

export default connect(mapStateToProps)(SearchPageListComp);

/*
 <View style={{
 backgroundColor: Colors.getRandomColor(), paddingTop: 10, paddingLeft: 10,
 paddingRight: 10,
 paddingBottom: 10,
 }}>
 {
 arr.map((model, i) => {
 return (
 <BaseTitleBt
 btStyle={[{
 width: (GlobalStyles.window.width - 30 - 20) / 3,
 borderRadius: 4, margin: 5, height: 45,
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: Colors.getRandomColor(),
 }]}
 onPress={null}
 textStyle={{
 fontSize: 15,
 color: Colors.black,
 }}
 title={model.title}
 disabled={false}
 >
 </BaseTitleBt>
 )
 })
 }
 </View>
 */