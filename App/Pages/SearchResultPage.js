/**
 * Created by Ebates on 17/1/18.
 *
 *  搜索结果页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ListView, Platform} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import GlobalStyles from '../Global/GlobalStyles'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import BaseSearchBar from '../Comp/Base/BaseSearchBar/BaseSearchBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BizSearchResultPagScrollableTabBar from '../Comp/BizCommonComp/BizSearchResultPagScrollableTabBar'
import SearchResultPageMerchantListContanier from '../Redux/Container/SearchResultPageMerchantListContanier'
import SearchResultPageCouponListContanier from '../Redux/Container/SearchResultPageCouponListContanier'
import *as BizApi from '../NetWork/API/BizApi'
import *as SearchResultPageActions from '../Redux/Actions/SearchResultPageActions'

/**
 *
 */
export class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e)=> baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.SearchResultPage
            });
        }
    }

    componentWillMount() {
        this.props.dispatch(SearchResultPageActions.getDefultTabLabelsAction());
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        Log.log('SearchResultPage componentWillUnmount')
    }

    onSubmit(value) {
        // this.props.dispatch(SearchResultPageActions.updateTabLabelsAction(BizApi.SearchResultPageMerchantListAPI.tabLabel, 111110));

    }

    /**
     * 为了让正在 滚动的 ScrollableTabView 关联的 BizSearchResultPagScrollableTabBar 的 底部 横线 在 判断到 滚到 其他 页面时, 及时 用其页面 对应的 tabbar的 Text 控件的 宽 计算 最新的 横线的 宽,避免 2个 tabbar.Text 控件 的 宽不一样时, 左右滚动 导致 横线位置不对
     * */
    onScroll=( i )=>{
        // Log.log('SearchResultPage onScroll i=='+i);
        if (this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.curTabIndex!=i){
            this.refs.scrollableTabView.refs.BizSearchResultPagScrollableTabBar.curTabIndex=i;
        }
    }

    render() {
        const {navigator} = this.props;

        let searchBar = <BaseSearchBar value={this.props.route.value}
                                       onSubmit={(value)=>this.onSubmit(value)
                                       }
                                       customContainerStyle={{paddingLeft: 10}}
                                       customInputStyle={{color: 'rgba(64, 64, 64, 1)', fontSize: 15}}
                                       customSearchStyle={{left: 16}}
                                       defaultPaddingRight={50}
                                       onFocusPaddingRight={37}
        />;
        //
        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.white} }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getBackButton(()=>baseOnBackPress(navigator, this.backAndroidEventListener))}
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
                        customRefs={['merchent', 'coupon']}
                        textStyle={{
                            fontSize: 14,
                            //backgroundColor: Colors.getRandomColor()
                        }}
                        underlineColor='rgba(67, 187, 78, 1)'
                        underLineBottom={10}
                        underlineHeight={2}/>}
                onScroll={(value)=>{
                    //暂时只有2个tab, 先写死,以后超过2个 再说
                    if (value>=0.5){
                        this.onScroll(1);
                    }else{
                        this.onScroll(0);
                    }
                }
                }
                onChangeTab={({/*可惜只在 自动滚动 停止 后 回调*/
                    i,
                    ref,
                    from,
                })=> {
                    {/*Log.log('SearchResultPage onChangeTab i=='+i);*/}
                    {/*this.refs.BizSearchResultPagScrollableTabBar.curTabIndex=i;*/}

                    {/*this.onChangeTab(i,ref,from);*/}
                }}
            >
                <SearchResultPageMerchantListContanier {...this.props}
                                                       tabLabel={this.props.baseReducer.merchantListTabLable }
                />
                <SearchResultPageCouponListContanier {...this.props}
                                                     tabLabel={this.props.baseReducer.couponListTabLable }
                />
            </ScrollableTabView>

        return (
            <View style={GlobalStyles.pageContainer}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                {content}
            </View>
        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SearchResultPageReducer}=state;
    return {baseReducer: SearchResultPageReducer};
}
export default connect(mapStateToProps)(SearchResultPage);