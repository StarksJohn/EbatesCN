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

import *as BaseListActions from '../../Redux/Actions/BaseListActions'
import *as BizApi from '../../NetWork/API/BizApi'
import GlobalStyles from '../../Global/GlobalStyles'
import Colors from '../../Utils/Colors'
import Spinner from 'react-native-spinkit'
import EventListener from '../../Utils/EventListener/EventListener'


export default class BaseListComp extends Component {

    constructor(props) {
        super(props);

        // this.category = this.props.category;
        this.curPageNo = 1;//页数从1开始
        // this.isLoadingMore = false;//是否正在加载更多, 被 BaseListActions.BaseListStatus.Loading 代替
        // this.onScroll = this.onScroll.bind(this);
        // this.isLoadAll = false;//列表数据是否全部加载完毕
    }

    static propTypes = {
        renderRow: PropTypes.func.isRequired,
        // listApiTag: PropTypes.object.isRequired  // 当前列表加载的接口对应的tag,区分其它列表的接口

        renderNoDataView: PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
        renderNetWorkAbnormalView:PropTypes.any,//外部可自定义如何绘制 列表无数据 状态的 view
        scrollRenderAheadDistance: PropTypes.number,//下一个 屏幕外的 cell(一般cell都是 从 屏幕底部 入屏) 距离屏幕多少像素时 就开始 画出来,避免 cell
        // 入屏后还没画完;如果cell 比较高,此值可设置小点,默认 1000 像素
        initialListSize: PropTypes.number,//初始状态下，要加载的数据条数等于 （默认为 10 条）；
        customContainer:PropTypes.any ,
    };

    static defaultProps = {
        onEndReachedThreshold: GlobalStyles.bottomTabBarHeight, //10,
        automaticallyAdjustContentInsets: false,
        scrollRenderAheadDistance: 1000,
        initialListSize: 10,
        customContainer:null,
        onScroll: () => {
        },
        renderScrollComponent: () => {
        },

    };

    componentWillMount() {
        this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);

    }

    componentDidMount() {
        // this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);

        //主动刷新 事件 监听,外部任何 地方都可能 让此列表 主动刷新,而不需要 下拉才能刷新
        this.activeRefreshListener = new EventListener({
            eventName: this.props.baseReducer.ApiName, eventCallback: ()=> {
                this._onRefresh();
            }
        });
    }

    componentWillUnmount() {
        this.props.dispatch(BaseListActions.WillUnmount(this.props.baseReducer.ApiName));

        if (this.activeRefreshListener) {
            this.activeRefreshListener.removeEventListener();
        }

    }

    /**
     * 加载 某个列表借口的 数据
     * opt: BaseListFetchDataType 类型
     */
    _fetchData(opt) {
        this.props.dispatch(BizApi.fetchApi(opt, this.countCurPageNo(opt) /*, this.props.baseReducer.ApiName*/,
            this.props));
    }

    renderNoDataViews() {
        if (this.props.renderNoDataView === false) {
            return null;
        } else if (this.props.renderNoDataView) {
            return React.cloneElement(this.props.renderNoDataView(this.props), this.props);
        } else {
            return null;
        }
    }

    /**
     * 画 网络异常
     * @returns {*}
     */
    renderNetWorkAbnormalView(){
        if (this.props.renderNetWorkAbnormalView) {
            return React.cloneElement(this.props.renderNetWorkAbnormalView(this.props), this.props);
        }  else {
            return null;
        }
    }

    /**
     * 返回false就 不改变 state
     */
    shouldComponentUpdate(nextProps, nextState) {

        // Log.log('shouldComponentUpdate nextProps==' + Log.log(Log.writeObjToJson(nextProps)));

        // if ( !(this.props.baseReducer.ApiName == nextProps.ApiName)) {
        //     Log.log('this.props.baseReducer.ApiName=='+this.props.baseReducer.ApiName);
        //     return false;
        // }

        // if (nextProps.status === BaseListActions.BaseListStatus.START) {
        //     Log.log('nextProps.status === BaseListActions.BaseListStatus.START')
        //
        //     return false;
        // } else

        if (nextProps.status === BaseListActions.BaseListStatus.FAILURE) {
            Log.log('nextProps.status === BaseListActions.BaseListStatus.FAILURE')

            if (nextProps.opt === BaseListActions.BaseListFetchDataType.REFRESH) {
                // 下拉刷新失败
                BizShowToast('刷新数据失败了...');
                return false;
            } else if (nextProps.opt === BaseListActions.BaseListFetchDataType.MORE) {
                // 加载更多失败
                BizShowToast('加载更多数据失败了...');
                this.curPageNo--;
                // this.isLoadingMore = false;
                return false;
            }
        }

        // Log.log('shouldComponentUpdate true')
        return true;
    }

    componentWillReceiveProps(nextProps) {
        // showToast('当前是  '+this.props.listApiTag.ApiName+'表的 componentWillReceiveProps 方法');

    }

    componentDidUpdate(prevProps, prevState) {
        // 处理加载更多操作时，在数据加载完成并渲染完界面后，将加载更多的状态重置

        // showToast('BaseListComp.componentDidUpdate.SUCCESS  prevProps.opt=='+prevProps.opt);

        if (prevProps.opt === BaseListActions.BaseListFetchDataType.MORE) {
            // this.isLoadingMore = false;
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
    // _onRetry() {
    //
    //     // this.props.dispatch(InitFetchinglist(this.props.listApiTag.ApiName));
    //
    //     // 延迟2秒再调用数据
    //     setTimeout(() => {
    //         // showToast('_onRetry');
    //
    //         Log.log('_onRetry');
    //         this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);
    //     }, 2000)
    //
    // }

    /**
     * 加载更多
     */
    onLoadMore = () => {
        if (/*this.isLoadingMore || !this.props.baseReducer.couldLoadMore*/ this.props.baseReducer.status === BaseListActions.BaseListStatus.Loading) {

            // showToast('_onLoadMore 出错 !!!  this.isLoadingMore==' + this.isLoadingMore + 'this.props.couldLoadMore==' + this.props.couldLoadMore);

            // Log.log('BaseListComp onLoadMore this.props.baseReducer.isRenderFooterView==' + this.props.baseReducer.isRenderFooterView)
            return;
        }

        Log.log('BaseListComp onLoadMore');

        this._fetchData(BaseListActions.BaseListFetchDataType.MORE);


        // this.isLoadingMore = true;

        // 延迟1秒再调用数据
        // setTimeout(() => {
        //     // showToast('_onLoadMore');
        //
        //     this._fetchData(BaseListActions.BaseListFetchDataType.MORE);
        // }, 1000)
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

        Log.log('BaseListComp _onRefresh this.props.baseReducer.meta.pagination'+this.props.baseReducer.meta.pagination);
        this._fetchData(BaseListActions.BaseListFetchDataType.REFRESH);

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
    //             `    </Text>
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
                    {/*<ProgressBar styleAttr="Small"/>*/}
                    <Text style={{marginLeft: 10, fontSize: 15, color: 'rgba(136, 136, 136, 1)'}}>
                        加载中
                    </Text>
                    <Spinner style={{
                        marginLeft: 5,
                        //backgroundColor: Colors.white
                    }} isVisible={true}
                             size={GlobalStyles.bottomTabBarHeight / 2.5} type='ThreeBounce'
                             color={Colors.backPopBtColor}//'rgba(136, 136, 136, 1)'
                    />
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
        // if (!this.props.baseReducer.couldLoadMore) {
        //     return this._allDataHasLoadedFooterView();
        // }
        //  else if (this.props.status === FETCH_LIST_DATA_STATUS.FAILURE) {
        //     return this._loadFaildFooterView();
        // } 
        // else if(this.isLoadingMore)

        if (this.props.baseReducer.status === BaseListActions.BaseListStatus.Loading) {
            return this._LoadingMoreFooterView();
        } else {
            return null;
        }
    }

    // _formatTime(time) {
    //     let date = new Date(time);
    //     return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // }

    render() {

        let contentView;
        // if (this.props.baseReducer.status === BaseListActions.BaseListStatus.INITIALIZE) {
        //     // contentView = <CommonLoadView loadState={LOAD_STATE.LOAD_STATE_ING}/>;
        // } else
        if (this.props.baseReducer.status === BaseListActions.BaseListStatus.FAILURE && this.props.baseReducer.dataArray.length == 0) {//一开始加载数据失败&&列表无数据
            // contentView = <CommonLoadView loadState={LOAD_STATE.LOAD_STATE_ERROR} onRetry={() => this._onRetry()}/>
            contentView=this.renderNetWorkAbnormalView();
        } else if (this.props.baseReducer.status === BaseListActions.BaseListStatus.NODATA) {//列表无缓存数据
            contentView = this.renderNoDataViews(); //<CommonLoadView loadState={LOAD_STATE.LOAD_STATE_NOCACHEDATA}/>

        } else {
            // showToast('BaseListComp  render');
            // showToast('正在 绘制 '+ this.props.listApiTag.ApiName +'列表');

            contentView = (
                <ListView
                    ref="ListView"
                    initialListSize={this.props.initialListSize}//
                    //pageSize={1}//
                    scrollRenderAheadDistance={this.props.scrollRenderAheadDistance}
                    dataSource={this.props.baseReducer.dataSource}
                    renderRow={ this.props.renderRow }
                    automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
                    onScroll={this.props.onScroll}
                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                    onEndReached={this.props.baseReducer.couldLoadMore ? /*this._onLoadMore.bind(this)*/ this.onLoadMore : null}
                    renderFooter={ this.props.baseReducer.isRenderFooterView ? () => this._renderFooter() : null}
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
            <View style={[styles.container,this.props.customContainer]}>
                {contentView}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(239, 239, 239, 1)',
        // paddingBottom:GlobalStyles.bottomTabBarHeight 此方式不能让listview的底部和 底部tabbar 有半透明效果
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 10,
        // paddingBottom: 10,
        height: GlobalStyles.bottomTabBarHeight,
        // backgroundColor: Colors.getRandomColor()
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