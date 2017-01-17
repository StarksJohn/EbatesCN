/**
 搜索页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text,ListView} from 'react-native';
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
import *as StringOauth from '../Utils/StringUtils/StringOauth'

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
        if (StringOauth.isNull(value)){
            Log.log('onSubmit 了一个 空字符串')
            return;
        }
        let self=this;
        HistorySearchDB.saveHistoryDB(value).then(()=> {
            Log.log('成功 缓存一个新的 历史搜索 关键字  '+ value);
            self.props.dispatch(BizApi.fetchApi(BaseListActions.BaseListFetchDataType.REFRESH, 0, self.props.baseReducer.ApiName));

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
        let searchList= <SearchPageListComp ref="searchList" {...this.props }
                                            onSubmit={(value)=>{
                                            this.onSubmit(value)
                                            }
                                            }
        />;

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



// export default class MyList extends Component {
//     constructor(props) {
//         super(props);
//         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//         this.state = {
//             data:  [{key:'row1'}, {key:'row2'}],
//             // data: ['row 1', 'row 2'],
//             dataSource: ds.cloneWithRows([{key:'row1'}]),
//             // dataSource: ds.cloneWithRows(['row 1']),
//         };
//     }
//     componentDidMount() {
//         this.setState({
//             dataSource: this.state.dataSource.cloneWithRows(this.state.data),
//         })
//         setTimeout(() => {
//             let _data = this.state.data;
//             let c = _data.concat({key:'row 3'})
//             // let c = _data.concat('row 3')
//             // console.log(c);
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRows(c),
//             })
//         },3000)
//     }
//
//     renderRow = (rowData, sectionID, rowID) => {
//         console.log('rowID===', rowID);
//         console.log('rowData===', rowData['key']);
//
//         return(
//             <Text>1</Text>
//         )
//     }
//     render() {
//         return (
//             <ListView
//                 dataSource={this.state.dataSource}
//                 renderRow={this.renderRow}
//             />
//         );
//     }
// }