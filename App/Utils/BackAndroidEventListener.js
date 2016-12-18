/**
 * BackAndroidComp
 * 有些页面不能直接pop, 如 webview里,安卓 下 点 back实体键 得先把webview里的 跳转pop完,再pop webview页面,此控件负责处理 监听安卓的 实体返回按钮,点击后 处理此控件绑定的特殊事件
 * 2级页面都得加这个对象,岂不是很Low ? 以后找优化方法
 * @flow
 */
'use strict';


import React from 'react';
import {
    BackAndroid,
} from 'react-native';


export default class BackAndroidEventListener {

    constructor(props) {
        this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }

    addEventListener() {
        if (this.props.backPress)BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    removeEventListener() {
        if (this.props.backPress)BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    onHardwareBackPress(e) {
        return this.props.backPress(e);
    }
}

