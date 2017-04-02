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
import *as BizApi from '../NetWork/API/BizApi'
import *as AllCouponPageApi from '../NetWork/API/AllCouponPageApi'
import *as BizDropDownMenuAndListActions from '../Redux/Actions/BizDropDownMenuAndListActions'
import *as BizDropDownMenuAndListInit from '../Redux/InitialState/BizDropDownMenuAndListInit'
import AllCouponPageCategoryListContanier from '../Redux/Container/AllCouponPageCategoryListContanier'
import AllCoupontPageListContanier,{AllCouponPageRefreshListEventName} from '../Redux/Container/AllCoupontPageListContanier'
import AllCouponPageSortListContanier from '../Redux/Container/AllCouponPageSortListContanier'

//改变 全部优惠页 导航栏title的 事件名
export const AllCouponPageChangeTitleEventName='AllCouponPageChangeTitleEventName';
//改变 全部优惠页 Category 下拉列表对应的MENU的title的  事件名
export const AllCouponPageChangeCategoryMenuTitleEventName = 'AllCouponPageChangeCategoryMenuTitleEventName';
//改变 全部优惠页 sort 下拉列表对应的MENU的title的  事件名
export const AllCouponPageChangeSortMenuTitleEventName = 'AllCouponPageChangeSortMenuTitleEventName';

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
        this.props.dispatch(AllCouponPageApi.AllCouponPageCategoryListApi.fetchCategoryList())
        this.props.dispatch(AllCouponPageApi.AllCouponPageSortDropDownListApi.fetchSortList())

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
        // let self = this;

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
                    renderMenuBar={(BizCommonDropDownCompContainerRef) => {
                        return <AllCouponPageMenuGridViewContainer
                            {...BizCommonDropDownCompContainerRef.props}
                            containerStyle={{zIndex: 1}}
                            onItemPress={(index) => {

                                if (BizCommonDropDownCompContainerRef.curSelctIndex == index) {
                                    BizCommonDropDownCompContainerRef.state.isShow ? BizCommonDropDownCompContainerRef._close() : BizCommonDropDownCompContainerRef.show(index);
                                } else if (BizCommonDropDownCompContainerRef.curSelctIndex != index && BizCommonDropDownCompContainerRef.state.isShow) {//当前切换 index && 下拉列表 容器 正在显示, 就不收回了, 直接 画 对应 index的 下拉列表控件
                                    BizCommonDropDownCompContainerRef.curSelctIndex = index;

                                    //改变 下拉列表 容器的 高, 让 AllMerchantPageDropDownCompContainer 重新 render, 就能 画 对应 Index 的 下拉列表控件了
                                    {
                                        if (index == 0) {//分类列表
                                            BizCommonDropDownCompContainerRef.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, AllCouponPageApi.AllCouponPageCategoryListApi.$CategoryListDataArray.size > 0 ? AllCouponPageApi.AllCouponPageCategoryListApi.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))
                                        }
                                       else if (index == 1) {//排序列表
                                            BizCommonDropDownCompContainerRef.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, AllCouponPageApi.AllCouponPageSortDropDownListApi.$SortListDataArray.size > 0 ? AllCouponPageApi.AllCouponPageSortDropDownListApi.$SortListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))
                                        }
                                        {/*else if (index == 3) {//筛选列表*/}
                                            {/*self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageFilterDropDownListApi.$FilterListDataArray.size > 0 ? GlobalStyles.AllMerchantPageFilterListH : BizDropDownMenuAndListInit.defaultH))*/}

                                        {/*}*/}
                                    }

                                } else if (BizCommonDropDownCompContainerRef.curSelctIndex != index && !BizCommonDropDownCompContainerRef.state.isShow) {
                                    BizCommonDropDownCompContainerRef.show(index)
                                }
                            }
                            }
                        >
                        </AllCouponPageMenuGridViewContainer>;
                    }
                    }
                    renderDropDownListContainer={(BizCommonDropDownCompContainerRef) => {
                        switch (BizCommonDropDownCompContainerRef.curSelctIndex) {
                            case 0://Category 列表
                            {
                                return <AllCouponPageCategoryListContanier
                                    refreshListEventName={AllCouponPageRefreshListEventName}
                                    onPress={
                                        () => {
                                            BizCommonDropDownCompContainerRef.props.onPress && BizCommonDropDownCompContainerRef.props.onPress();
                                            BizCommonDropDownCompContainerRef._close();
                                        }
                                    }
                                >
                                </AllCouponPageCategoryListContanier>;
                            }
                                break;
                            case 1://排序 列表
                            {
                                return <AllCouponPageSortListContanier
                                    refreshListEventName={AllCouponPageRefreshListEventName}
                                    onPress={
                                        () => {
                                            BizCommonDropDownCompContainerRef.props.onPress && BizCommonDropDownCompContainerRef.props.onPress();
                                            BizCommonDropDownCompContainerRef._close();
                                        }
                                    }
                                >
                                </AllCouponPageSortListContanier>;
                            }
                                break;
                        }
                    }}

                    WillUnmount={
                        ()=>{
                            this.props.dispatch(AllCouponPageApi.AllCouponPageCategoryListApi.releaseCategoryListData())
                            this.props.dispatch(AllCouponPageApi.AllCouponPageSortDropDownListApi.releaseSortListData())
                            {/*this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.releaseFilterListData())*/}
                        }
                    }
                />
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                <AllCoupontPageListContanier
                    ref='AllCoupontPageListContanier'
                    navigator={this.props.navigator}
                    //customContainer={{position: "absolute", top: DropDownListDefualtY, bottom: 0, left: 0, right: 0}}
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