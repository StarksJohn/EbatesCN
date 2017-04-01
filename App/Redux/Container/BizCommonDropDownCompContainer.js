/**
 * Created by Ebates on 2017/3/28.
 * AllMerchantPageDropDownCompContainer
 * 业务逻辑通用的 包含 menu和 下拉列表的 筛选容器控件
 */
import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Animated,
    ScrollView,
    ActivityIndicator, Easing
} from 'react-native'
import {connect} from 'react-redux';
import GlobalStyles from '../../Global/GlobalStyles'
import AllMerchantPageMenuGridViewContainer from './AllMerchantPageMenuGridViewContainer'
import *as BizApi from '../../NetWork/API/BizApi'
import BaseBt from '../../Comp/Base/BaseBt'
import Colors from '../../Utils/Colors'
import *as BizDropDownMenuAndListActions from '../Actions/BizDropDownMenuAndListActions'



export class BizCommonDropDownCompContainer extends Component {
    static propTypes = {
        //dropDownListCompArr: React.PropTypes.array, //存 点击 不同 menu 后,下拉列表的容器里 显示的不同 数据源的 下拉列表控件
        onPress: React.PropTypes.func,//点击下拉列表里的item 回调,包括单选item和 筛选 列表的 确定按钮,都回调
        // onChangeOrderAsc: React.PropTypes.func,//改变 外部 默认列表的排序
        renderMenuBar: PropTypes.any,//外部画 Menu
        renderDropDownListContainer:React.PropTypes.func,//外部 画 下拉列表
        WillUnmount:React.PropTypes.func,//外部处理此控件 卸载时 的事情
    }

    constructor(props) {
        super(props);

        this.curSelctIndex = 0;//当前选择的 几号下拉列表
    }

    //下拉视图的 y
    orderByModalYValue = new Animated.Value(0);

    fadeInOpacity= new Animated.Value(0); // 初始值

    state = {
        isShow: false,//是否显示 下拉列表,不显示就 不画, 节省内存, 比master 分支 的代码好
        currentType: '常见',
        orderAsc: 1
    }

    componentWillMount() {
        // this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.fetchCategoryList())
        // ;
        // this.props.dispatch(BizApi.AllMerchantPageCountryListApi.fetchCountryList());
        // this.props.dispatch(BizApi.AllMerchantPageSortDropDownListApi.fetchSortList());
        // this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.fetchFilterList());

    }

    componentWillUnmount() {
        Log.log('BizCommonDropDownCompContainer componentWillUnmount ');

        this.props.dispatch(BizDropDownMenuAndListActions.resetDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName));
        this.props.WillUnmount&&this.props.WillUnmount();

        // this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.releaseCategoryListData())
        // this.props.dispatch(BizApi.AllMerchantPageCountryListApi.releaseCountryListData())
        // this.props.dispatch(BizApi.AllMerchantPageSortDropDownListApi.releaseSortListData())
        // this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.releaseFilterListData())
        // this.props.dispatch(BizDropDownMenuAndListActions.resetDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName));

    }

    //点击 Menu 按钮 回调,展开 下拉列表
    show(index) {
        // Log.log('BizCommonDropDownCompContainer show index='+index)
        this.curSelctIndex = index;

        this.setState({isShow: true}, () => {
            // Animated.timing(this.orderByModalYValue, {
            //     toValue: 1,
            //     duration: 250,
            //     easing: Easing.sin
            // }).start();

            let timing = Animated.timing;
            //同时执行2个动画
            Animated.parallel(['orderByModalYValue','fadeInOpacity'].map(property => {
                return timing(this[property], {
                    toValue: 1,
                    duration: 250/2,
                    easing: Easing.sin//sin
                });
            })).start();
        });

    }

    _close() {
        // this.curSelctIndex=-1;
        let self = this;
        // Animated.timing(this.orderByModalYValue, {
        //     toValue: 0,
        //     duration: 250,easing: Easing.sin
        // }).start(() => self.setState({isShow: false}))

        let timing = Animated.timing;
        //同时执行2个动画
        Animated.parallel(['orderByModalYValue','fadeInOpacity'].map(property => {
            return timing(this[property], {
                toValue: 0,
                duration: 250/2,
                easing: Easing.sin
            });
        })).start( () => self.setState({isShow: false}) );

    }

    /**
     * 计算 下拉列表的最大 高
     * @param height
     */
    countDropListH(height) {
        let maxHeight = gScreen.height - (this.curSelctIndex != 3 ? 95 : 0)/*屏幕底部往上到 下拉列表 最大Y的距离, 筛选列表 最高可到 屏幕底部,因其 确定按钮得 固定画 */ - gScreen.navBarHeight - GlobalStyles.AllMerchantPageMenuBtH;
        return height < maxHeight ? height : maxHeight;
    }

    renderMenuBar(self) {
        // let self = this;
        if (this.props.renderMenuBar === false) {
            return null;
        } else if (this.props.renderMenuBar) {
            // return React.cloneElement(this.props.renderMenuBar(self));
            return this.props.renderMenuBar(self);
        } else {//默认 menuBar
            // return BizDropDownMenuAndListActions
        }
    }

    render() {
        Log.log('BizCommonDropDownCompContainer render()')
        const {dataSource,} = this.props
        const {isShow, currentType, orderAsc} = this.state
        const backgroundColor = this.orderByModalYValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', 'rgba(1,1,1,0.6)']
        })

        //下拉列表容器 的高
        const contentHeight = this.countDropListH(this.props.baseReducer.DropDownListHeight)//gScreen.height * 0.4;

        //下拉列表容器 的 y
        const contentYPosition = this.orderByModalYValue.interpolate({
            inputRange: [0, 1],
            outputRange: [/*-contentHeight*/ (gScreen.navBarHeight + GlobalStyles.AllMerchantPageMenuBtH) * -1/*让ListView 挂载时,其Top在屏幕内,否则0号cell就显示不出来*/, 0]
        })

        return (
            <View style={{zIndex: 1}}>
                {/*MenuBar*/}
                {this.renderMenuBar(this)}
                {/*不画时 AllMerchantPageCategoryListContanier就卸载了*/}
                {isShow &&
                //下拉列表的 萌层容器,包括 下拉列表和其下边的 用于点击隐藏下拉列表的蒙层按钮
                <Animated.View style={[styles.animatedCover, {backgroundColor}]}
                >
                    {/*下拉列表的容器*/}
                    <Animated.View style={[styles.animatedContent, {top: contentYPosition, height: contentHeight,
                        opacity:this.fadeInOpacity
                    }]}>
                        {this.props.renderDropDownListContainer&&this.props.renderDropDownListContainer(this)}
                    </Animated.View>
                    {/*下拉列表下边 可点击隐藏 下拉列表的 按钮*/}
                    <BaseBt
                        style={ [{
                            backgroundColor: Colors.transparent, position: 'absolute', top: contentHeight, left: 0,
                            right: 0, bottom: 0
                        }]}
                        activeOpacity={0.5}
                        disabled={false}
                        onPress={
                            () => {
                                this._close()
                            }
                        }
                    >
                    </BaseBt>
                </Animated.View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    foodItem: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    foodNameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(194,194,198)',
        height: 60,
        width: gScreen.width - 60,
        paddingRight: 10,
    },
    healthLight: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgb(142, 213, 7)',
        marginRight: 0,
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: gScreen.navBarHeight + 44,
        marginTop: -gScreen.navBarHeight,
        paddingTop: gScreen.navBarHeight,
        borderBottomColor: '#d5d5d5'
    },
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    orderByFont: {
        fontSize: 13,
        marginRight: 5
    },
    sortTypeItem: {
        borderBottomColor: '#d5d5d5',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: gScreen.width / 3,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    loadingProgress: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    //比 下拉列表 视图层级 低一层 的 黑色半透明 蒙层 的 style,他的 top是 menuBar的 bottom 开始
    animatedCover: {
        position: 'absolute',
        top: GlobalStyles.AllMerchantPageMenuBtH,
        left: 0,
        right: 0,
        height: gScreen.height - gScreen.navBarHeight - GlobalStyles.AllMerchantPageMenuBtH,
    },
    animatedContent: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    subcategoryWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: gScreen.width,
        height: gScreen.height - gScreen.navBarHeight,
        justifyContent: 'flex-end',
        zIndex: 1
    },
    subcategoryAnimatedWrapper: {
        backgroundColor: 'rgba(83, 83, 83, 0.85)',
        position: 'absolute',
        right: 10,
        borderRadius: 4
    },
    subcategoryItem: {
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: 'rgba(255,255,255,0.6)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 13,
        marginLeft: 8,
        color: '#333'
    }
})

function mapStateToProps(state) {
    const {BizDropDownMenuAndListReducer}=state;
    return {
        baseReducer: BizDropDownMenuAndListReducer,
    };

}

export default connect(mapStateToProps)(BizCommonDropDownCompContainer);