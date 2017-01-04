/**
 * Created by Ebates on 17/1/4.
 *
 * 有左图 抽屉效果的 组件
 */
import React, {PropTypes, Component} from 'react'
import { DeviceEventEmitter} from 'react-native';
import Drawer from 'react-native-drawer';
import LeftPanelView from './LeftPanelView'
import tweens from './tweens'
import EventListener from '../../Utils/EventListener/EventListener'

export const openDrawerEventName = 'openDrawerEventName';//任何地方都可发送的打开左屏的事件名字
export const closeDrawerEventName = 'closeDrawerEventName';//任何地方都可发送的关闭左屏的事件名字


export default class LeftDrawerComponent extends Component {

    static propTypes = {
        children: PropTypes.node,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            drawerType: 'displace',
            openDrawerOffset: 100,//中图view 在左图打开时 显示的 宽度
            closedDrawerOffset: 0,
            panOpenMask: .1,
            panCloseMask: .9,
            relativeDrag: false,
            panThreshold: .25,//拖动多大距离就打开左屏|关闭左屏
            tweenHandlerOn: false,
            tweenDuration: 350/2, //展开|关闭 左屏动画的 速度
            tweenEasing: 'easeInOutCirc',//加速效果
            disabled: false,
            tweenHandlerPreset: null,
            acceptDoubleTap: false,
            acceptTap: false,
            acceptPan: true,
            tapToClose: true,
            negotiatePan: false,
            rightSide: false,
        };
    }

    componentDidMount() {
        this.openListener = new EventListener({
            eventName: openDrawerEventName, eventCallback: ()=> {
                this.drawer.open();
            }
        });

        this.closeListener = new EventListener({
            eventName: closeDrawerEventName, eventCallback: ()=> {
                this.drawer.close();
            }
        });
    }

    componentWillUnmount() {
        if (this.openListener) {
            this.openListener.removeEventListener();
        }

        if (this.closeListener) {
            this.closeListener.removeEventListener();
        }
    }

    tweenHandler(ratio) {
        if (!this.state.tweenHandlerPreset) {
            return {}
        }
        return tweens[this.state.tweenHandlerPreset](ratio)
    }

    noopChange() {
        this.setState({
            changeVal: Math.random()
        })
    }

    //打开侧屏
    openDrawer() {
        this.drawer.open();

    }

    render() {
        //左图
        let controlPanel = <LeftPanelView
            //closeDrawer={() => {this.drawer.close();}}
        />;

        return (
            <Drawer
                ref={ref => this.drawer = ref}
                type={this.state.drawerType}
                animation={this.state.animation}
                openDrawerOffset={this.state.openDrawerOffset}
                closedDrawerOffset={this.state.closedDrawerOffset}
                panOpenMask={this.state.panOpenMask}
                panCloseMask={this.state.panCloseMask}
                relativeDrag={this.state.relativeDrag}
                panThreshold={this.state.panThreshold}
                content={controlPanel}
                styles={drawerStyles}
                disabled={this.state.disabled}
                tweenHandler={this.tweenHandler.bind(this)}
                tweenDuration={this.state.tweenDuration}
                tweenEasing={this.state.tweenEasing}
                acceptDoubleTap={this.state.acceptDoubleTap}
                acceptTap={this.state.acceptTap}
                acceptPan={this.state.acceptPan}
                tapToClose={this.state.tapToClose}
                negotiatePan={this.state.negotiatePan}
                changeVal={this.state.changeVal}
                side={this.state.rightSide ? 'right' : 'left'}
            >
                {this.props.children}
            </Drawer>
        );
    }
}

const drawerStyles = {
    drawer: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 0,
    }
}