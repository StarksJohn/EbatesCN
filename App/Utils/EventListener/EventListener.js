/**
 * 通用的 处理事件监听的 对象
 * @flow
 */
'use strict';


import React, {PropTypes, Component} from 'react'
import {
    DeviceEventEmitter
} from 'react-native';

/**
 * 任何地方都可调用的 发送 某个消息的 方法
 */
export function sendEvent(eventName,extraInfo) {
    DeviceEventEmitter.emit(eventName,extraInfo);
}

export default class EventListener {

    static propTypes = {
        eventName: PropTypes.string,//事件名字
        eventCallback: PropTypes.func,//事件回调

    };
    static defaultProps = {
        eventName: '',
        eventCallback: null
    };

    /**
     *
     * @param props {eventName:'', eventCallback:()=>{} }
     */
    constructor(props) {
        this.props = props;

        this.listener = DeviceEventEmitter.addListener(this.props.eventName, this.props.eventCallback);
    }

    removeEventListener() {
        this.listener.remove();
    }
}

