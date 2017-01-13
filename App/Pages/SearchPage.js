/**
 搜索页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import BaseNavigationBar from '../Comp/Base/BaseNavigationBar'
import *as GlobalConst from '../Global/GlobalConst'
import GlobalStyles from '../Global/GlobalStyles'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import SearchPageListComp from '../Comp/BizList/SearchPageListComp'
import *as HistorySearchDB from '../DB/BizDB/HistorySearchDB'
import *as BizApi from '../NetWork/API/BizApi'
import *as BaseListActions from '../Redux/Actions/BaseListActions'

/**
 *  展示组件
 */
export class SearchPage extends Component {

    constructor(props) {
        super(props);

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
    }

    onSubmit(value){
        HistorySearchDB.saveHistoryDB(value,this).then((handeler)=> {
            // if (b)
            {
                Log.log('成功 缓存一个新的 历史搜索 关键字  '+ value);
                // this.refs.searchList.refreshHistoryList();

                handeler.props.dispatch(BizApi.fetchApi(BaseListActions.BaseListFetchDataType.REFRESH, 0, this.props.baseReducer.ApiName));

            }

        }).catch((e)=> {

        });

    }

    render() {
        const { navigator} = this.props;

        let searchBar=<BaseSearchBar placeholder="输入商家,  优惠名称"
                                     onSubmit={(value)=>this.onSubmit(value)
                                     }
        />;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                searchBar={searchBar}
                hide={false}/>;
        let searchList= <SearchPageListComp ref="searchList" {...this.props }/>;

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

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SearchPageListReducer}=state;
    return {baseReducer: SearchPageListReducer};
}
export default connect(mapStateToProps)(SearchPage);