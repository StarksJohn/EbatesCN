/**
 通用列表控件, 可参考 http://git.oschina.net/rplees/react-native-gitosc  项目的 OSCRefreshListView
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    Text,
    View,
    ActivityIndicator as ProgressBar, InteractionManager, Image
} from 'react-native';

// import CommonLoadView, {LOAD_STATE,} from './CommonLoadView';
// import {FETCH_LIST_DATA_STATUS, LIST_FETCH_TYPE, InitFetchinglist} from '../../actions/ActionTypes';
import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import GlobalStyles from '../../Global/GlobalStyles'
import Colors from '../../Utils/Colors'
// import ViewUtils from '../../utils/ViewUtils'

// const propTypes = {
//     renderRow: PropTypes.func.isRequired,
//     listApiTag: PropTypes.object  // 当前列表加载的接口对应的tag,区分其它列表的接口
// };

export default class BaseListComp extends Component {

    constructor(props) {
        super(props);

        // this.category = this.props.category;
        this.curPageNo = 1;//页数从1开始
        this.isLoadingMore = false;//是否正在加载更多
        // this.onScroll = this.onScroll.bind(this);
        // this.isLoadAll = false;//列表数据是否全部加载完毕
    }

    static propTypes = {
        renderRow: PropTypes.func.isRequired,
        // listApiTag: PropTypes.object.isRequired  // 当前列表加载的接口对应的tag,区分其它列表的接口
    };

    static defaultProps = {
        onEndReachedThreshold: 10,
        automaticallyAdjustContentInsets: false,
        onScroll: ()=> {
        },
        renderScrollComponent: ()=> {
        },

    };

    componentDidMount() {

        // this.props.dispatch({type:BaseListActions.BaseListStatus.INITIALIZE});//初始化 列表的 定制 UI

        this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);

    }

    /**
     * 加载 某个列表借口的 数据
     * opt: BaseListFetchDataType 类型
     */
    _fetchData(opt) {
        // Log.log('opt== ' +opt )
        // Log.log('this.countCurPageNo(opt)== ' +this.countCurPageNo(opt) )
        // Log.log('this.props.baseReducer.ApiName== ' +this.props.baseReducer.ApiName )

        this.props.dispatch(BizApi.fetchApi(opt, this.countCurPageNo(opt), this.props.baseReducer.ApiName));
    }


    /**
     * 返回false就 不改变 state
     */
    shouldComponentUpdate(nextProps, nextState) {

        Log.log('shouldComponentUpdate nextProps=='+Log.log(Log.writeObjToJson(nextProps)));

        // if ( !(this.props.baseReducer.ApiName == nextProps.ApiName)) {
        //     Log.log('this.props.baseReducer.ApiName=='+this.props.baseReducer.ApiName);
        //     return false;
        // }

        if (nextProps.status === BaseListActions.BaseListStatus.START) {
            Log.log('nextProps.status === BaseListActions.BaseListStatus.START')

            return false;
        } else if (nextProps.status === BaseListActions.BaseListStatus.FAILURE) {
            Log.log('nextProps.status === BaseListActions.BaseListStatus.FAILURE')

            if (nextProps.opt === BaseListActions.BaseListFetchDataType.REFRESH) {
                // 下拉刷新失败
                showToast('刷新数据失败了...');
                return false;
            } else if (nextProps.opt === BaseListActions.BaseListFetchDataType.MORE) {
                // 加载更多失败
                showToast('加载更多数据失败了...');
                this.curPageNo--;
                this.isLoadingMore = false;
                return false;
            }
        }

        Log.log('shouldComponentUpdate true')
        return true;
    }

    componentWillReceiveProps(nextProps) {
        // showToast('当前是  '+this.props.listApiTag.ApiName+'表的 componentWillReceiveProps 方法');

    }

    componentDidUpdate(prevProps, prevState) {
        // 处理加载更多操作时，在数据加载完成并渲染完界面后，将加载更多的状态重置

        // showToast('BaseListComp.componentDidUpdate.SUCCESS  prevProps.opt=='+prevProps.opt);

        if (prevProps.opt === BaseListActions.BaseListFetchDataType.MORE) {
            this.isLoadingMore = false;
        }
    }

    // onScroll = () =>{
    //
    // }

    /**
     * 根据列表的请求方式 计算 需要请求第几页
     */
    countCurPageNo(opt) {
        switch (opt) {
            case BaseListActions.BaseListFetchDataType.INITIALIZE :
            case BaseListActions.BaseListFetchDataType.REFRESH : {
                return this.curPageNo = 1;
            }
            case BaseListActions.BaseListFetchDataType.MORE: {
                return ++this.curPageNo;
            }
        }
    }

    /**
     * 一开始加载失败后 重加载第一页 , 和 下拉刷新 不一样
     */
    _onRetry() {

        // this.props.dispatch(InitFetchinglist(this.props.listApiTag.ApiName));

        // 延迟2秒再调用数据
        setTimeout(() => {
            // showToast('_onRetry');

            Log.log('_onRetry');
            this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);
        }, 2000)

    }

    /**
     * 加载更多
     */
    onLoadMore = () => {
        if (this.isLoadingMore || !this.props.baseReducer.couldLoadMore) {

            // showToast('_onLoadMore 出错 !!!  this.isLoadingMore==' + this.isLoadingMore + 'this.props.couldLoadMore==' + this.props.couldLoadMore);

            return;
        }

        this.isLoadingMore = true;

        // 延迟1秒再调用数据
        setTimeout(() => {
            // showToast('_onLoadMore');

            this._fetchData(BaseListActions.BaseListFetchDataType.MORE);
        }, 1000)
    }

    /**
     * 下拉刷新
     */
    _onRefresh() {
        // if (this.props.listApiTag.removeAllListData()) {
        //     // showToast('_onRetry  ok ');
        //
        //     this.props.dispatch(InitFetchinglist(this.props.listApiTag.ApiName));
        //
        //     // showToast('_onRefresh');
        //     this._fetchData(LIST_FETCH_TYPE.INITIALIZE);
        //
        // }
    }

    /**
     * 列表加载更多失败后底部显示的view
     * 暂时在 加载更多失败时 不显示此view, 继续转菊花, 因不好处理
     */
    // _loadFaildFooterView() {
    //     return (
    //         <CommonTouchableComp onPress={ () => this._onLoadMore() }>
    //             <View style={styles.footerContainer}>
    //                 <Text>
    //                     加载失败,点击重试
    //                 </Text>
    //             </View>
    //         </CommonTouchableComp>

    //     );
    // }

    /**
     * 画 正在加载更多 的 footerview
     */
    _LoadingMoreFooterView() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.footerContainer}>
                    <ProgressBar styleAttr="Small"/>
                    <Text>
                        正在加载中...
                    </Text>
                </View>
                {/*{ViewUtils.renderBottomTabbarBackView()}*/}

            </View>

        );
    }

    /**
     * 画 列表的 所有数据已加载完毕 的 footerview
     */
    _allDataHasLoadedFooterView() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.footerContainer}>
                    <Text>
                        加载完毕
                    </Text>
                </View>
                {/*{ViewUtils.renderBottomTabbarBackView()}*/}
            </View>

        );
    }

    _renderFooter() {
        if (!this.props.baseReducer.couldLoadMore) {
            return this._allDataHasLoadedFooterView();
        }
        //  else if (this.props.status === FETCH_LIST_DATA_STATUS.FAILURE) {
        //     return this._loadFaildFooterView();
        // } 
        // else if(this.isLoadingMore)
        {
            return this._LoadingMoreFooterView();
        }
    }

    // _formatTime(time) {
    //     let date = new Date(time);
    //     return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // }

    render() {

        let contentView;
        if (this.props.baseReducer.status === BaseListActions.BaseListStatus.INITIALIZE) {
            // contentView = <CommonLoadView loadState={LOAD_STATE.LOAD_STATE_ING}/>;
        } else if (this.props.baseReducer.status === BaseListActions.BaseListStatus.FAILURE && this.props.baseReducer.dataArray.length == 0) {//一开始加载数据失败&&列表无数据
            // contentView = <CommonLoadView loadState={LOAD_STATE.LOAD_STATE_ERROR} onRetry={() => this._onRetry()}/>
        } else if (this.props.baseReducer.status === BaseListActions.BaseListStatus.NODATA) {//列表无缓存数据
            // contentView = <CommonLoadView loadState={LOAD_STATE.LOAD_STATE_NOCACHEDATA}/>

        } else {
            // showToast('BaseListComp  render');
            // showToast('正在 绘制 '+ this.props.listApiTag.ApiName +'列表');

            contentView = (
                <ListView
                    ref="ListView"
                    dataSource={this.props.baseReducer.dataSource}
                    renderRow={ this.props.renderRow }
                    automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
                    onScroll={this.props.onScroll}
                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                    onEndReached={this.props.baseReducer.couldLoadMore ? /*this._onLoadMore.bind(this)*/ this.onLoadMore : null}
                    renderFooter={ this.props.baseReducer.isRenderFooterView?() => this._renderFooter():null}
                    refreshControl={this.props.baseReducer.isRenderRefreshControl ?
                        <RefreshControl
                            style={{backgroundColor: Colors.transparent}}
                            refreshing={this.props.baseReducer.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor='#AAAAAA'
                            title='下拉刷新'
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                            progressBackgroundColor='#FFFFFF'/> : null}
                    /*renderScrollComponent={this.props.renderScrollComponent}*/
                    /*renderScrollComponent={
                     (props) => (
                     this.props.ParallaxScrollView
                     )
                     }*/
                    /*{...this.props}*/
                />
            );
        }
        return (
            <View style={styles.container}>
                {contentView}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.getRandomColor(),
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 10,
        // paddingBottom: 10,
        height: GlobalStyles.bottomTabBarHeight,
        backgroundColor: Colors.getRandomColor()
    },

    plainTitleContainer: {
        marginTop: 30,
        paddingLeft: 5,
        // borderLeftColor: 'red',
        borderLeftWidth: 5,
        backgroundColor: Colors.translucentColor('0', '0', '0', '0.3')
    },
    titleFont: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    subTitle: {
        marginTop: 30,
        color: 'white',
        fontSize: 13,
        marginRight: 15, marginLeft: 10,
    },
    ctime: {
        marginTop: 30,
        color: 'white',
        fontSize: 13,
        marginLeft: 10,
    },
    cellTitle: {
        // backgroundColor: 'red'

    },
    line2ItemViewContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000000',
    },
    author: {
        flex: 1,
        fontSize: 14,
        color: '#999999',
    },
    time: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'right',
    },
    separator: {
        height: 1,
        backgroundColor: '#cccccc',
    },


});

// BaseListComp.propTypes = propTypes;