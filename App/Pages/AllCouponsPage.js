/**
 * Created by Ebates on 2017/4/1.
 * AllCouponsPage.js
 * 全部优惠 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image, Animated} from 'react-native';
import {connect} from 'react-redux'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import SearchPage from './SearchPage'
import GlobalStyles from '../Global/GlobalStyles'
import BaseImgBt from '../Comp/Base/BaseImgBt'
import BizCommonDropDownCompContainer from '../Redux/Container/BizCommonDropDownCompContainer'
import AllCouponPageMenuGridViewContainer,{AllCouponPageMenuGridViewArrowDirResetEventName} from '../Redux/Container/AllCouponPageMenuGridViewContainer'

//改变 全部优惠页 导航栏title的 事件名
export const AllCouponPageChangeTitleEventName='AllCouponPageChangeTitleEventName';

export class AllCouponsPage extends Component {
    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.AllCouponsPage
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    onSearch() {
        this.props.navigator.push({
            component: SearchPage,
            name: gRouteName.SearchPage,
            isInTwoLevelPage: true,
        });
    }

    render() {

        Log.log('AllCouponsPage render');
        let self = this;

        const {navigator} = this.props;
        let rightBt = <BaseImgBt
            btStyle={{
                height: 35, width: 35, alignItems: 'center',
                justifyContent: 'center', marginRight: 5,
                //backgroundColor: Colors.getRandomColor(),
            }}
            imgStyle={{
                width: 20, height: 20,
                //backgroundColor:Colors.getRandomColor()
            }}
            localPath={require('../Img/search.png')}
            onPress={
                () => this.onSearch()
            }
        >
        </BaseImgBt>

        let navigationBar =<BaseNavigationBar
            style={ [{backgroundColor: Colors.white},{zIndex: 2}] }
            statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
            titleTextView={null}
            leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
            rightButton={rightBt}
            searchBar={null}
            hide={false}
            title='全部优惠'
            changeTitleEventName={AllCouponPageChangeTitleEventName}
            titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
        />;

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>

                {navigationBar}
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                <BizCommonDropDownCompContainer
                    onPress={
                        () => {
                            //this.onPress()
                        }
                    }
                    resetAllArrowsDirEventName={AllCouponPageMenuGridViewArrowDirResetEventName }
                    renderMenuBar={(self) => {
                        return <AllCouponPageMenuGridViewContainer
                            {...self.props}
                            containerStyle={{zIndex: 1}}
                            onItemPress={(index) => {

                                if (self.curSelctIndex == index) {
                                    self.state.isShow ? self._close() : self.show(index);
                                } else if (self.curSelctIndex != index && self.state.isShow) {//当前切换 index && 下拉列表 容器 正在显示, 就不收回了, 直接 画 对应 index的 下拉列表控件
                                    self.curSelctIndex = index;

                                    //改变 下拉列表 容器的 高, 让 AllMerchantPageDropDownCompContainer 重新 render, 就能 画 对应 Index 的 下拉列表控件了
                                    {/*{*/}
                                        {/*if (index == 0) {//母婴列表*/}
                                            {/*self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageCategoryListApi.$CategoryListDataArray.size > 0 ? BizApi.AllMerchantPageCategoryListApi.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))*/}
                                        {/*}*/}
                                        {/*else if (index == 1) {//国家列表*/}
                                            {/*self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageCountryListApi.$CountryListDataArray.size > 0 ? BizApi.AllMerchantPageCountryListApi.$CountryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))*/}
                                        {/*} else if (index == 2) {//排序列表*/}
                                            {/*self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageSortDropDownListApi.$SortListDataArray.size > 0 ? BizApi.AllMerchantPageSortDropDownListApi.$SortListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))*/}
                                        {/*} else if (index == 3) {//筛选列表*/}
                                            {/*self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageFilterDropDownListApi.$FilterListDataArray.size > 0 ? GlobalStyles.AllMerchantPageFilterListH : BizDropDownMenuAndListInit.defaultH))*/}

                                        {/*}*/}
                                    {/*}*/}

                                } else if (self.curSelctIndex != index && !self.state.isShow) {
                                    self.show(index)
                                }
                            }
                            }
                        >
                        </AllCouponPageMenuGridViewContainer>;
                    }
                    }

                    WillUnmount={
                        ()=>{
                            {/*this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.releaseCategoryListData())*/}
                            {/*this.props.dispatch(BizApi.AllMerchantPageCountryListApi.releaseCountryListData())*/}
                            {/*this.props.dispatch(BizApi.AllMerchantPageSortDropDownListApi.releaseSortListData())*/}
                            {/*this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.releaseFilterListData())*/}
                        }
                    }
                />
            </View>
        );
    }

}


//
function mapStateToProps(state) {

    // 把 state里的 xxx 注入到 this.props里
    const {AllMerchantPageReducer}=state;
    return {baseReducer: AllMerchantPageReducer};
}

export default connect(mapStateToProps)(AllCouponsPage)