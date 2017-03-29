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
import AllMerchantPageDropDownCompContainer from '../Redux/Container/AllMerchantPageDropDownCompContainer'


const DropDownListDefualtY = GlobalStyles.statusBarAndNavBarH + GlobalStyles.AllMerchantPageMenuBtH;//下拉视图 显示时 Y的 起点

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

    componentWillUnmount() {
        // this.props.dispatch(BizApi.AllMerchantPageApi.fetchPageData());
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

    // onMenuBtSelect(i) {
    //     const {baseReducer} = this.props;
    //
    //     Animated.sequence([
    //         // 1)同时执行 营养素frameY、箭头角度 2个动画
    //         Animated.parallel([
    //             Animated.timing(baseReducer.DropDownListY, {
    //                 toValue: baseReducer.isShowDropDownlist ? 0 : 1,
    //                 duration: 500,
    //             }),
    //             // Animated.timing(this.state.angleRotation, {
    //             //     toValue: FoodsList.showSortTypeView ? 0 : 1,
    //             //     duration: 500,
    //             // })
    //         ]),
    //         // 2)遮盖层透明度
    //         // Animated.timing(this.state.coverViewOpacity, {
    //         //     toValue: FoodsList.showSortTypeView ? 0 : 1,
    //         //     duration: 100,
    //         // })
    //     ]).start();
    // }

    render() {

        Log.log('AllMerchantPage render');

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

        let navigationBar = BizViews.renderBaseNavigationBar(null, NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener)), rightBt, null, '全部商家', {}, /*{position: "absolute", top: 0,  left: 0,
         right: 0}*/ {zIndex: 2});

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>

                {/*下拉列表*/}
                {/*{this.renderDropDownList()}*/}
                {navigationBar}
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                <AllMerchantPageDropDownCompContainer
                    onSelectItem={this.onSelectItem}
                    //onChangeOrderAsc={this._onChangeOrderAsc}
                />
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}
                {/*商家列表*/}
                <AllMerchantPageListContanier
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

