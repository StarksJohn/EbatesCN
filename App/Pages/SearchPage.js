/**
 搜索页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import BaseNavigationBar from '../Comp/Base/BaseNavigationBar'
import GlobalStyles from '../Global/GlobalStyles'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import SearchPageListComp from '../Comp/BizList/SearchPageListComp'
import *as HistorySearchDB from '../DB/BizDB/HistorySearchDB'
import *as BizApi from '../NetWork/API/BizApi'
import *as BaseListActions from '../Redux/Actions/BaseListActions'
import *as StringOauth from '../Utils/StringUtils/StringOauth'
import SearchResultPage from './SearchResultPage'
import *as BizViews from '../Comp/BizCommonComp/BizViews'

/**
 *  展示组件
 */
export class SearchPage extends Component {

    constructor(props) {
        super(props);

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    componentDidMount() {

    }

    /**
     * 由于点击 热门搜索按钮, 产生的 搜索控件 失去焦点,然后 搜索控件的 value变为 关键词, 并 页面跳转
     */
    onBlur() {
        Log.log('SearchPage onBlur');

        // this.refs.searchList.onPress
    }

    onSubmit(value) {
        if (StringOauth.isNull(value)) {
            Log.log('onSubmit 了一个 空字符串')
            return;
        }
        let self = this;
        HistorySearchDB.saveHistoryDB(value).then(()=> {
            // Log.log('成功 缓存一个新的 历史搜索 关键字  '+ value);
            self.props.dispatch(BizApi.fetchApi(BaseListActions.BaseListFetchDataType.REFRESH, 0, self.props));

        }).catch((e)=> {

        });

        this.props.navigator.push({
            component: SearchResultPage,
            name: gRouteName.SearchResultPage,
            value: value,

        });
    }

    /**
     * 点击 热门搜索按钮后,改变 BaseSearchBar 的 state
     * @param value
     */
    onChangeBaseSearchBarText(value) {
        this.refs.refBaseSearchBar.NonkeyboardChangeText(value);

        // this.props.navigator.push({
        //     component: SearchResultPage,
        //     name: gRouteName.SearchResultPage,
        //     value: value,
        //
        // });
    }

    onCancel(isClearValue) {
        this.refs.refBaseSearchBar.onCancel(isClearValue);
    }

    render() {
        // const { navigator} = this.props;

        let searchBar = <BaseSearchBar ref="refBaseSearchBar"
                                       placeholder="输入商家,  优惠名称"
                                       onSubmit={(value)=>this.onSubmit(value)
                                       }
                                       onBlur={()=> {
                                           this.onBlur();
                                       }
                                       }
        />;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                searchBar={searchBar}
                hide={false}/>;
        let searchList = <SearchPageListComp ref="searchList" {...this.props }
                                             onSubmit={(value)=> {
                                                 this.onSubmit(value)
                                             }
                                             }

                                             onChangeBaseSearchBarText={(value)=> {
                                                 this.onChangeBaseSearchBarText(value)
                                             }
                                             }
                                             onCancel={(isClearValue)=> {
                                                 this.onCancel(isClearValue);
                                             }
                                             }
        />;

        return (
            <View style={GlobalStyles.pageContainer}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                {searchList}
            </View>
        );
    }

}


function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SearchPageListReducer}=state;
    return {baseReducer: SearchPageListReducer};
}
export default connect(mapStateToProps)(SearchPage);