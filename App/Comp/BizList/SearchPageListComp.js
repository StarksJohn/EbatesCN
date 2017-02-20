/**
 搜索页的 列表
 */

import React, {Component} from 'react';
import {
    View, Text
} from 'react-native';
// import {connect} from 'react-redux';
// import RecommendedFoodListCellContainer from '../../containers/RecommendedFoodListCellContainer'
import Colors from '../../Utils/Colors'
import BaseListComp from '../Base/BaseListComp';
import *as BizViews from '../BizCommonComp/BizViews'
import BaseTitleBt from '../Base/BaseTitleBt'
import *as GlobalStyles from '../../Global/GlobalStyles'
import BaseGridView from '../Base/BaseGridView'
import *as BizApi from '../../NetWork/API/BizApi'
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as HistorySearchDB from '../../DB/BizDB/HistorySearchDB'


export default class SearchPageListComp extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * 点击 热门搜索|历史搜索 的 按钮
     * @param model
     */
    onPress(title) {
        // BizShowToast(title);
        this.props.onSubmit(title);
        // this.props.onChangeBaseSearchBarText(title);
        this.props.onCancel(true);
    }

    /**
     * 全部清除 历史搜索
     */
    clearAllHistorySearch() {
        // BizShowToast('clearAllHistorySearch');
        this.props.dispatch(BizApi.SearchPageListApi.clearAllHistorySearch(BaseListActions.BaseListFetchDataType.REFRESH));
        HistorySearchDB.clearHistoryDB();
    }

    /**
     * 删除一个关键词
     * @param word
     */
    deleteOneKeyWord(word) {
        // BizShowToast('deleteOneKeyWord  '+word);

        this.props.dispatch(BizApi.SearchPageListApi.deleteOneKeyWord(word, BaseListActions.BaseListFetchDataType.REFRESH));

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

        // console.log('SearchPageListComp rowID==' + rowID);

        //最底部画 占位view
        if (rowID == this.props.baseReducer.dataArray.length - 1) {
            // Log.log('this.props.baseReducer.dataArray.length=='+this.props.baseReducer.dataArray.length);
            return BizViews.renderBottomTabbarBackView();
        }

        switch (rowID) {
            case '0': {
                let arr = rowData.toJSArray();
                return (
                    <View style={{
                        //height: 208,//按钮数量不确定,故高度不能写死
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        <Text style={{
                            color: 'rgba(64, 64, 64, 1)',
                            fontSize: 14, marginLeft: 15, marginTop: 23,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            热门搜索
                        </Text>
                        <BaseGridView
                            items={Array.from(arr)}//数组元素是 {id:'',name:''}
                            containerStyle={{
                                paddingLeft: 10,
                                paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                                //backgroundColor: Colors.getRandomColor()
                            }}
                            renderItem={(model/*此处的model是 Immutable .map 结构*/)=> {
                                return (
                                    <BaseTitleBt
                                        key={model.get('title')}
                                        btStyle={[{
                                            width: (GlobalStyles.window.width - 30 - 20) / 3-0.1 /*减0.1是因为大屏上,/3后的值可能
                                             比 实际的值大, 避免 一行大屏 里 一行显示不下3个按钮*/,
                                            borderRadius: 4, margin: 5, height: 45,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: Colors.white,
                                        }]}
                                        onPress={() => this.onPress(model.get('title'))}
                                        textStyle={{
                                            fontSize: 14,
                                            color: 'rgba(85, 85, 85, 1)',
                                        }}
                                        title={model.get('title')}
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
            case '1'://历史搜索cell
            {
                return (
                    <View style={{
                        height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',
                        marginTop: 0,
                        //backgroundColor: Colors.getRandomColor()
                    }}>
                        <Text style={{
                            color: 'rgba(64, 64, 64, 1)',
                            fontSize: 14, marginLeft: 15,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            历史搜索
                        </Text>
                        {/*q全部清除按钮*/}
                        <BaseTitleBt
                            btStyle={[{
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center', marginRight: 15,
                                backgroundColor: Colors.transparent,
                            }]}
                            onPress={() => this.clearAllHistorySearch()}
                            textStyle={{
                                fontSize: 12,
                                color: 'rgba(136, 136, 136, 1)',
                            }}
                            title='全部清除'
                            disabled={false}
                        >
                        </BaseTitleBt>
                    </View>
                );
            }
                break;
            default://画 关键字cell
            {
                return (
                    <View style={{
                        flex: 1
                    }}>
                        <BaseTitleBt
                            key={rowData}
                            btStyle={[{
                                height: 45, flexDirection: 'row', justifyContent: 'space-between',
                                alignItems: 'center',
                                //backgroundColor: Colors.getRandomColor(),
                            }]}
                            onPress={() => this.onPress(rowData)}
                            textStyle={{
                                fontSize: 15,
                                color: 'rgba(85, 85, 85, 1)', marginLeft: 15,
                                //backgroundColor: Colors.getRandomColor()
                            }}
                            title={rowData}
                            disabled={false}
                        >
                            {BizViews.deleteBox(()=> {
                                this.deleteOneKeyWord(rowData);
                            })}
                        </BaseTitleBt>
                        {BizViews.baseSpeLine({marginLeft: 15, marginTop: -0.5})}
                    </View>
                );
            }
                break;
        }
        return (null);

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <BaseListComp
                    {...this.props }
                    renderRow={
                        this.renderRow
                    }

                />
            </View>

        );
    }

}

// function mapStateToProps(state) {
//
//     //推荐此种  解构赋值的写法
//     const {SearchPageListReducer}=state;
//     // let newProps={...SearchPageListReducer};
//     return {baseReducer: SearchPageListReducer};
// }

// export default connect(mapStateToProps)(SearchPageListComp);