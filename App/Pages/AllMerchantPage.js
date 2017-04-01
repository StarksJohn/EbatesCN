/**
 * Created by Ebates on 17/2/24.
 * AllMerchantPage  全部商家
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image, Animated} from 'react-native';
import {connect} from 'react-redux'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import BaseFontAwesomeIconBts from '../Comp/Base/BaseFontAwesomeIconBts'
import BaseImgBt from '../Comp/Base/BaseImgBt'
import SearchPage from './SearchPage'
import *as BizApi from '../NetWork/API/BizApi'
import BizMerchantListCell from '../Comp/BizCells/BizMerchantListCell'
import AllMerchantPageListContanier from '../Redux/Container/AllMerchantPageListContanier'
import GlobalStyles from '../Global/GlobalStyles'
import BizCommonDropDownCompContainer from '../Redux/Container/BizCommonDropDownCompContainer'
import *as BizDropDownMenuAndListActions from '../Redux/Actions/BizDropDownMenuAndListActions'
import *as BizDropDownMenuAndListInit from '../Redux/InitialState/BizDropDownMenuAndListInit'
import AllMerchantPageMenuGridViewContainer ,{AllMerchantPageMenuGridViewArrowDirResetEventName }from '../Redux/Container/AllMerchantPageMenuGridViewContainer'
import AllMerchantPageCategoryListContanier from '../Redux/Container/AllMerchantPageCategoryListContanier'
import AllMerchantPageCountryListContanier from '../Redux/Container/AllMerchantPageCountryListContanier'
import AllMerchantPageSortListContanier from '../Redux/Container/AllMerchantPageSortListContanier'
import AllMerchantPageFilterListContanier from '../Redux/Container/AllMerchantPageFilterListContanier'

const DropDownListDefualtY = GlobalStyles.statusBarAndNavBarH + GlobalStyles.AllMerchantPageMenuBtH;//下拉视图 显示时 Y的 起点

//改变 全部商家页 导航栏title的 事件名
export const AllMerchantPagechangeTitleEventName = 'AllMerchantPagechangeTitleEventName';

//改变 全部商家页 Category 下拉列表对应的MENU的title的  事件名
export const AllMerchantPageChangeCategoryMenuTitleEventName = 'AllMerchantPageChangeCategoryMenuTitleEventName';

//改变 全部商家页 country 下拉列表对应的MENU的title的  事件名
export const AllMerchantPageChangeCountryMenuTitleEventName = 'AllMerchantPageChangeCountryMenuTitleEventName';

//改变 全部商家页 sort 下拉列表对应的MENU的title的  事件名
export const AllMerchantPageChangeSortMenuTitleEventName = 'AllMerchantPageChangeSortMenuTitleEventName';

//改变 全部商家页 Filter 下拉列表对应的MENU的title的  事件名
export const AllMerchantPageChangeFilterMenuTitleEventName = 'AllMerchantPageChangeFilterMenuTitleEventName';



export class AllMerchantPage extends Component {
    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.AllMerchantPage
            });
        }
    }

    componentDidMount() {
        this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.fetchCategoryList())
        ;
        this.props.dispatch(BizApi.AllMerchantPageCountryListApi.fetchCountryList());
        this.props.dispatch(BizApi.AllMerchantPageSortDropDownListApi.fetchSortList());
        this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.fetchFilterList());
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


    onPress() {

    }

    render() {

        Log.log('AllMerchantPage render');
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

        let navigationBar = <BaseNavigationBar
            style={ [{backgroundColor: Colors.white}, {zIndex: 2}] }
            statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
            titleTextView={null}
            leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
            rightButton={rightBt}
            searchBar={null}
            hide={false}
            title='全部商家'
            changeTitleEventName={AllMerchantPagechangeTitleEventName}
            titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
        />
        // BizViews.renderBaseNavigationBar(null, NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener)), rightBt, null, '全部商家', {}, /*{position: "absolute", top: 0,  left: 0,
        // right: 0}*/ {zIndex: 2});

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>

                {/*下拉列表*/}
                {/*{this.renderDropDownList()}*/}
                {navigationBar}
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                <BizCommonDropDownCompContainer
                    onPress={
                        () => {
                            this.onPress()
                        }
                    }
                    resetAllArrowsDirEventName={AllMerchantPageMenuGridViewArrowDirResetEventName}
                    renderMenuBar={(self) => {
                        return <AllMerchantPageMenuGridViewContainer
                            {...self.props}
                            containerStyle={{zIndex: 1}}
                            onItemPress={(index) => {

                                if (self.curSelctIndex == index) {
                                    self.state.isShow ? self._close() : self.show(index);
                                } else if (self.curSelctIndex != index && self.state.isShow) {//当前切换 index && 下拉列表 容器 正在显示, 就不收回了, 直接 画 对应 index的 下拉列表控件
                                    self.curSelctIndex = index;

                                    //改变 下拉列表 容器的 高, 让 AllMerchantPageDropDownCompContainer 重新 render, 就能 画 对应 Index 的 下拉列表控件了
                                    {
                                        if (index == 0) {//母婴列表
                                            self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageCategoryListApi.$CategoryListDataArray.size > 0 ? BizApi.AllMerchantPageCategoryListApi.$CategoryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))
                                        }
                                        else if (index == 1) {//国家列表
                                            self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageCountryListApi.$CountryListDataArray.size > 0 ? BizApi.AllMerchantPageCountryListApi.$CountryListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))
                                        } else if (index == 2) {//排序列表
                                            self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageSortDropDownListApi.$SortListDataArray.size > 0 ? BizApi.AllMerchantPageSortDropDownListApi.$SortListDataArray.size * GlobalStyles.AllMerchantPageDropDownListCellH : BizDropDownMenuAndListInit.defaultH))
                                        } else if (index == 3) {//筛选列表
                                            self.props.dispatch(BizDropDownMenuAndListActions.changeDropDownListHAction(BizApi.BizDropDownMenuAndListApi.ApiName, BizApi.AllMerchantPageFilterDropDownListApi.$FilterListDataArray.size > 0 ? GlobalStyles.AllMerchantPageFilterListH : BizDropDownMenuAndListInit.defaultH))

                                        }
                                    }

                                } else if (self.curSelctIndex != index && !self.state.isShow) {
                                    self.show(index)
                                }
                            }
                            }
                        >
                        </AllMerchantPageMenuGridViewContainer>;
                    }
                    }

                    renderDropDownListContainer={(self) => {
                        switch (self.curSelctIndex) {
                            case 0://Category 列表
                            {
                                return <AllMerchantPageCategoryListContanier
                                    onPress={
                                        () => {
                                            self.props.onPress && self.props.onPress();
                                            self._close();
                                        }
                                    }
                                >
                                </AllMerchantPageCategoryListContanier>;
                            }
                                break;
                            case 1://国家列表
                            {
                                return <AllMerchantPageCountryListContanier
                                    onPress={
                                        () => {
                                            self.props.onPress && self.props.onPress();
                                            self._close();
                                        }
                                    }
                                >
                                </AllMerchantPageCountryListContanier>;
                            }
                                break
                            case 2://排序列表
                            {
                                return <AllMerchantPageSortListContanier
                                    onPress={
                                        () => {
                                            self.props.onPress && self.props.onPress();
                                            self._close();
                                        }
                                    }
                                >
                                </AllMerchantPageSortListContanier>;
                            }
                                break
                            case 3://筛选列表
                            {
                                return <AllMerchantPageFilterListContanier
                                    onPress={
                                        () => {
                                            self.props.onPress && self.props.onPress();
                                            self._close();
                                        }
                                    }
                                >
                                </AllMerchantPageFilterListContanier>;
                            }
                                break
                        }
                    }}
                    WillUnmount={
                        ()=>{
                            this.props.dispatch(BizApi.AllMerchantPageCategoryListApi.releaseCategoryListData())
                            this.props.dispatch(BizApi.AllMerchantPageCountryListApi.releaseCountryListData())
                            this.props.dispatch(BizApi.AllMerchantPageSortDropDownListApi.releaseSortListData())
                            this.props.dispatch(BizApi.AllMerchantPageFilterDropDownListApi.releaseFilterListData())
                        }
                    }
                />
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                {/*商家列表*/}
                <AllMerchantPageListContanier
                    ref='AllMerchantPageListContanierRef'
                    navigator={this.props.navigator}
                    //customContainer={{position: "absolute", top: DropDownListDefualtY, bottom: 0, left: 0, right: 0}}
                />

            </View>
        );
    }

}
const styles = StyleSheet.create({
    dropDownListStyle: {
        //flexDirection: 'row',
        // flexWrap: 'wrap',
        position: 'absolute',
        backgroundColor: Colors.getRandomColor(), //'white',
        borderBottomColor: '#ccc',
        width: GlobalStyles.window.width,
        paddingTop: 10,
    }
});
//
function mapStateToProps(state) {

    // 把 state里的 xxx 注入到 this.props里
    const {AllMerchantPageReducer}=state;
    return {baseReducer: AllMerchantPageReducer};
}

export default connect(mapStateToProps)(AllMerchantPage)

