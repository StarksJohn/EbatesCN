/**
 * Created by Ebates on 16/12/15.
 * 自定义 react-native-easy-toast,实现事件监听
 */
import React, {Component} from 'react';
import { DeviceEventEmitter} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

export const ShowToastSignal='showToast';//显示toast 的信号

export function showToast(showMsg) {

    DeviceEventEmitter.emit(ShowToastSignal, showMsg);
}

export default class BizToast extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(ShowToastSignal, (text) => {
            this.refs.toastWithStyle.show(text, DURATION.LENGTH_SHORT);

        });
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    render() {
        return (
            <Toast ref="toastWithStyle"
                   style={{backgroundColor: Colors.black, borderRadius: 4,padding: 20 }}
                   opacity={0.8}//透明度
                   positionValue={200}//黑框的Y的起点
                   textStyle={{
                       fontSize: 13, lineHeight: 20,color: Colors.white, fontWeight: 'bold'
                   }} position={'top'}/>
        );
    }
}

