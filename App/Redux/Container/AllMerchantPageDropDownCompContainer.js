/**
 * Created by Ebates on 2017/3/28.
 * AllMerchantPageDropDownCompContainer
 * 全部商家页 包含 menu和 下拉列表的 筛选容器控件
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
    ActivityIndicator
} from 'react-native'
import {connect} from 'react-redux';
import GlobalStyles from '../../Global/GlobalStyles'
import AllMerchantPageMenuGridViewContainer from './AllMerchantPageMenuGridViewContainer'
import *as BizApi from '../../NetWork/API/BizApi'
import BaseBt from '../../Comp/Base/BaseBt'
import Colors from '../../Utils/Colors'
import AllMerchantPageCategoryListContanier from './AllMerchantPageCategoryListContanier'
import AllMerchantPageCountryListContanier from './AllMerchantPageCountryListContanier'
import *as BizDropDownMenuAndListActions from '../Actions/BizDropDownMenuAndListActions'

export class AllMerchantPageDropDownCompContainer extends Component {
    static propTypes = {
        //dropDownListCompArr: React.PropTypes.array, //存 点击 不同 menu 后,下拉列表的容器里 显示的不同 数据源的 下拉列表控件
        onSelectItem: React.PropTypes.func,//点击下拉列表里的item 回调
        onChangeOrderAsc: React.PropTypes.func,//改变 外部 默认列表的排序
        renderMenuBar: PropTypes.any,
    }

    constructor(props) {
        super(props);

        this.curSelctIndex=0;//当前选择的 几号下拉列表

        this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.fetchCategoryList())
        ;
        this.props.dispatch(BizApi.AllMerchantPageCountryListApi.fetchCountryList());
    }

    //下拉视图的 y
    orderByModalYValue = new Animated.Value(0);

    state = {
        isShow: false,//是否显示 下拉列表,不显示就 不画, 节省内存, 比master 分支 的代码好
        currentType: '常见',
        orderAsc: 1
    }

    componentWillUnmount() {
        Log.log('BizDropDownMenuAndListContainer componentWillUnmount ');
        this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.releaseCategoryListData())
        this.props.dispatch(BizApi.AllMerchantPageCountryListApi.releaseCountryListData())
        this.props.dispatch(BizDropDownMenuAndListActions.resetDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName));

    }

    //点击 Menu 按钮 回调,展开 下拉列表
    show (index) {
        // Log.log('AllMerchantPageDropDownCompContainer show index='+index)
        this.curSelctIndex=index;

        this.setState({isShow: true}, () => {
            Animated.timing(this.orderByModalYValue, {
                toValue: 1,
                duration: 250,
            }).start()
        })
    }

    _close  () {
        Animated.timing(this.orderByModalYValue, {
            toValue: 0,
            duration: 250,
        }).start(() => this.setState({isShow: false}))
    }

    //改变 外部 默认列表的排序
    _onChangeOrderAsc = () => {
        const {orderAsc} = this.state
        const {onChangeOrderAsc} = this.props
        this.setState({orderAsc: orderAsc == 0 ? 1 : 0}, () => {
            onChangeOrderAsc && onChangeOrderAsc(orderAsc)
        })
    }

    //点击 下拉列表 里的 按钮 回调
    _onPressSortTypeCell = type => {
        const {onSelectItem} = this.props
        this.setState({currentType: type.name})
        Animated.timing(this.orderByModalYValue, {
            toValue: 0,
            duration: 250,
        }).start(() => {
            onSelectItem && onSelectItem(type)
            this.setState({isShow: false})
        })
    }

    /**
     * 计算 下拉列表的最大 高
     * @param height
     */
    countDropListH(height) {
        let maxHeight = gScreen.height - 95/*屏幕底部往上到 下拉列表 最大Y的距离 */ - gScreen.navBarHeight - GlobalStyles.AllMerchantPageMenuBtH;
        return height < maxHeight ? height : maxHeight;
    }

    /**
     * 画 下拉列表里的 item
     * @param type
     * @param key
     * @returns {XML}
     * @private
     */
    // _renderSortTypeCell = (type, key) => {
    //     const {sortTypes} = this.props
    //     const {currentType} = this.state
    //     const isLast = sortTypes.length - 1 == key
    //     const titleStyle = [{fontSize: 13, color: '#333'}]
    //     if (currentType == type.name) titleStyle.push({color: 'rgb(253,84,94)'})
    //     return (
    //         <TouchableOpacity
    //             key={`${type.name}-${key}`}
    //             activeOpacity={0.75}
    //             style={[styles.sortTypeItem, isLast && {width: gScreen.width}]}
    //             onPress={() => this._onPressSortTypeCell(type)}
    //         >
    //             <Text style={titleStyle}>{type.name}</Text>
    //         </TouchableOpacity>
    //     )
    // }

    renderMenuBar() {
        if (this.props.renderMenuBar === false) {
            return null;
        } else if (this.props.renderMenuBar) {
            return React.cloneElement(this.props.renderMenuBar());
        } else {//默认 menuBar
            return <AllMerchantPageMenuGridViewContainer
                {...this.props}
                containerStyle={{zIndex: 1}}
                onItemPress={(index) => {

                    this.state.isShow ? this._close() : this.show(index);
                }
                }
            >
            </AllMerchantPageMenuGridViewContainer>;
        }
    }

    //画 下拉处理的 列表控件
    renderDropDownListContainer(){
        switch (this.curSelctIndex){
            case 0://Category 列表
            {
                return <AllMerchantPageCategoryListContanier
                    ref={
                        (r) => {
                            this.CategoryListRef = r;
                        }
                    }
                >
                </AllMerchantPageCategoryListContanier>;
            }
            break;
            case 1://商家列表
            {
                return <AllMerchantPageCountryListContanier
                    ref={
                        (r) => {
                            this.CategoryListRef = r;
                        }
                    }
                >
                </AllMerchantPageCountryListContanier>;
            }
            break
        }
    }

    render() {
        Log.log('BizDropDownListContainer render()')
        const {dataSource,} = this.props
        const {isShow, currentType, orderAsc} = this.state
        const backgroundColor = this.orderByModalYValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', 'rgba(1,1,1,0.3)']
        })

        //下拉列表的高
        const contentHeight = this.countDropListH(this.props.baseReducer.DropDownListHeight)//gScreen.height * 0.4;

        //下拉列表的 y
        const contentYPosition = this.orderByModalYValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-contentHeight, 0]
        })

        // const rotate = isShow ? '180deg' : '0deg'
        // const orderAscSrc = orderAsc == 1 ? require('../../resource/ic_food_ordering_down.png') : require('../../resource/ic_food_ordering_up.png')
        // const orderAscStr = orderAsc == 1 ? '由高到低' : '由低到高'

        return (
            <View style={{zIndex: 1}}>
                {/*MenuBar*/}
                {this.renderMenuBar()}
                {/*不画时 AllMerchantPageCategoryListContanier就卸载了*/}
                {isShow &&
                //下拉列表的 萌层容器,包括 下拉列表和其下边的 用于点击隐藏下拉列表的蒙层按钮
                <Animated.View style={[styles.animatedCover, {backgroundColor}]}
                               accessible={true}
                               onAccessibilityTap={() => {
                                   Log.log('BizDropDownListContainer render() onAccessibilityTap')
                               }}
                >
                    {/*下拉列表的容器*/}
                    <Animated.View style={[styles.animatedContent, {top: contentYPosition, height: contentHeight}]}>
                        {this.renderDropDownListContainer()}
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
                            this._close
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

export default connect(mapStateToProps)(AllMerchantPageDropDownCompContainer);