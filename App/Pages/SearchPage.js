/**
 搜索页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../Utils/Colors';
import BaseNavigationBar from '../Comp/Base/BaseNavigationBar'
import *as GlobalConst from '../Global/GlobalConst'
import GlobalStyles from '../Global/GlobalStyles'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import SearchPageListComp from '../Comp/BizList/SearchPageListComp'

/**
 *  展示组件
 */
export default class SearchPage extends Component {

    constructor(props) {
        super(props);

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
    }

    render() {
        const { navigator} = this.props;

        let searchBar=<BaseSearchBar placeholder="输入商家,  优惠名称" />;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                searchBar={searchBar}
                hide={false}/>;
        let searchList= <SearchPageListComp />;

        return (
            <View style={styles.container}>
                {navigationBar}
                {searchList}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: Colors.white,
    },
});

