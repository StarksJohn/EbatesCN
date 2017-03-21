/**
 首页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, InteractionManager} from 'react-native';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton} from '../Comp/Base/BaseNavigationBar'
import *as GlobalConst from '../Global/GlobalConst'
import LogInPage from './LogInPage'
import *as TokenAPI from '../NetWork/API/TokenAPI'
import *as LeftDrawerComponent from '../Root/LeftDrawerComponent/LeftDrawerComponent'
import *as EventListener from '../Utils/EventListener/EventListener'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import GlobalStyles from '../Global/GlobalStyles'
import SearchPage from './SearchPage'
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import BizSearchResultPagScrollableTabBar from '../Comp/BizCommonComp/BizSearchResultPagScrollableTabBar'
import HomePageHotCouponList from '../Comp/BizList/HomePageHotCouponList'
import HomePageCouponListRankContanier from '../Redux/Container/HomePageCouponListRankContanier'
import HomePageEBCouponListContanier from '../Redux/Container/HomePageEBCouponListContanier'

/**
 *  展示组件
 */
class HomePage extends Component {

    constructor(props) {
        super(props);

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);

        this.tabLabelArr = ['热门优惠', '优惠排行', 'EB独家优惠'];
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
    }

    componentWillUnmount() {
        Log.log('componentWillUnmount');
    }

    /*
     左上角点击
     */
    onBarsPress() {
        // showToast('onBarsPress');
        // InteractionManager.runAfterInteractions(() => {
        //     this.props.navigator.push({
        //         component: LogPage
        //     });
        // });

        // this.props.navigator.push({
        //     component: LogInPage,
        //     name:gRouteName.LogInPage//'LogInPage'
        // });
        // global.gPopBackToRouteAfteRegisterSuceess=gRouteName.RootPagesContainer;

        // TokenAPI.getTokenWhenAppOpen();

        EventListener.sendEvent(LeftDrawerComponent.openDrawerEventName)
    }

    onFocus() {
        this.props.navigator.push({
            component: SearchPage,
            name: gRouteName.SearchPage,
            isInTwoLevelPage: true,
        });
    }

    /**
     * 为了让正在 滚动的 ScrollableTabView 关联的 BizSearchResultPagScrollableTabBar 的 底部 横线 在 判断到 滚到 其他 页面时, 及时 用其页面 对应的 tabbar的 Text 控件的 宽 计算 最新的 横线的 宽,避免 多 个 BizSearchResultPagScrollableTabBar.tabbar.Text 控件 的 宽不一样时, 左右滚动 导致 横线位置不对
     * */
    onScroll = (value) => {
        this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.updataCurTabIndex(value);
    }

    onChangeTab = (i, ref, from) => {
        //避免 滚动停止时, curTabIndex 还没变化
        this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.isNeedUpdataCurTabIndex = true;
        // Log.log('SearchResultPage onChangeTab isNeedUpdataCurTabIndex ==' + this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.isNeedUpdataCurTabIndex);

        if (this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.curTabIndex != i) {
            this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.curTabIndex = i;
            this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.updateTabUnderlineWidth();
            // Log.log('SearchResultPage onChangeTab curTabIndex ==' + this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.curTabIndex);
        }
    }

    render() {
        const {HomePageReducer, navigator} = this.props;

        let searchBar =
            <BaseSearchBar
                ref="refBaseSearchBar" placeholder='搜索' value=''
                onFocus={() => this.onFocus()
                }
                customContainerStyle={{paddingLeft: 10, backgroundColor: Colors.appUnifiedBackColor}}
                customInputStyle={{color: 'rgba(64, 64, 64, 1)', fontSize: 15, backgroundColor: Colors.white}}
                customSearchStyle={{left: 16}}
                defaultPaddingRight={50}
                onFocusPaddingRight={37}
            />;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.appUnifiedBackColor} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                leftButton={NavBarButton.getBarsButton(() => this.onBarsPress())}
                titleTextView={null}
                searchBar={searchBar}
                hide={false}/>;

        let content =
            <ScrollableTabView
                ref="scrollableTabView"
                renderTabBar={() =>
                    <BizSearchResultPagScrollableTabBar
                        ref="BizSearchResultPagScrollableTabBar"
                        style={{height: 45, borderWidth: 0, elevation: 0.1}}
                        tabStyle={{height: 45}}
                        activeTextColor='rgba(54, 166, 66, 1)'
                        tabBarBackgroundColor={Colors.white}
                        tabBarUnderlineColor={Colors.appUnifiedBackColor}
                        inactiveTextColor={Colors.BizCommonBlack}
                        customRefs={this.tabLabelArr}
                        textStyle={{
                            fontSize: 14,
                            //backgroundColor: Colors.getRandomColor()
                        }}
                        underlineColor='rgba(67, 187, 78, 1)'
                        underLineBottom={10}
                        underlineHeight={2}/>
                }
                onScroll={(value) => {
                    //暂时只有2个tab, 先写死,以后超过2个 再说
                    this.onScroll(value);
                }
                }
                onChangeTab={({
                    /*只在 自动滚动 停止 后 回调,*/
                    i,
                    ref,
                    from,
                }) => {
                    this.onChangeTab(i, ref, from);
                }}
            >
                <HomePageHotCouponList {...this.props} tabLabel={this.tabLabelArr[0]}/>
                <HomePageCouponListRankContanier {...this.props} tabLabel={this.tabLabelArr[1]}/>
                <HomePageEBCouponListContanier {...this.props} tabLabel={this.tabLabelArr[2]}/>
            </ScrollableTabView>

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        // backgroundColor: Colors.getRandomColor(),
    },
});

export default HomePage;
