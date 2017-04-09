/**
 * Created by Ebates on 2017/4/9.
 * AboutEbatesCnPage.js 关于 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, TextInput} from 'react-native';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'

export default class AboutEbatesCnPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.AboutEbatesCnPage
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }
}

