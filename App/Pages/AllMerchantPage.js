/**
 * Created by Ebates on 17/2/24.
 * AllMerchantPage  全部商家
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image} from 'react-native';
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import BaseFontAwesomeIconBts from '../Comp/Base/BaseFontAwesomeIconBts'
import BaseImgBt from '../Comp/Base/BaseImgBt'
import SearchPage from './SearchPage'
import BizFilterMenuView from '../Comp/BizCommonComp/BizFilterMenuView'

export default class AllMerchantPage extends Component {
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

    /**
     * 画 下拉出来的列表
     */
    renderDropdownListView(){

    }

    render() {
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

        let navigationBar = BizViews.renderBaseNavigationBar(null, NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener)), rightBt, null, '全部商家', {} );

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                <BizFilterMenuView
                    onItemPress={(index)=>{
                        Log.log('AllMerchantPage render onItemPress index='+index);
                    }}
                />
            </View>
        );
    }

}