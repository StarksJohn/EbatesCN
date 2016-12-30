/**
 * BackAndroidComp
 * 有些页面不能直接pop, 如 webview里,安卓 下 点 back实体键 得先把webview里的 跳转pop完,再pop webview页面,此控件负责处理 监听安卓的 实体返回按钮,点击后 处理此控件绑定的特殊事件
 * 2级页面都得加这个对象,岂不是很Low ? 以后找优化方法
 * @flow
 */
'use strict';


import React from 'react';
import {
    BackAndroid,DeviceEventEmitter
} from 'react-native';

export const removeBackAndroidEventListener='removeBackAndroidEventListener';

export default class BackAndroidEventListener {

    constructor(props) {
        //拦截硬件设备的Back返回键事件; 如果没有设置任何监听函数或者监听函数返回false，那么会调用默认的返回键功能进行退出应用
        this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
        this.addEventListener();

        this.listener = DeviceEventEmitter.addListener(removeBackAndroidEventListener, (text) => {
            if (text===this.props.hardwareBackPressListenerName){

                this.removeEventListener();
                // showToast('DeviceEventEmitter remove =='+text)
            }
        });
    }

    addEventListener() {
        if (this.props.backPress){
            BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
        }
    }

    removeEventListener() {
        if (this.props.backPress){
            this.listener.remove();
            // this.listener=null;
            BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
            // showToast('BackAndroid.removeEventListener=== '+this.props.hardwareBackPressListenerName)
        }
    }

    onHardwareBackPress(e) {
        // return this.props.backPress(e);

        if (this.props.backPress(e)){
            DeviceEventEmitter.emit(removeBackAndroidEventListener, this.props.hardwareBackPressListenerName);
            // return true;
        }
        return true;
    }
}

