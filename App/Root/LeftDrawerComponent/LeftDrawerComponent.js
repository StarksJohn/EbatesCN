/**
 * Created by Ebates on 17/1/4.
 *
 * 有左图 抽屉效果的 组件
 */
import React, {Component} from 'react';
import Drawer from 'react-native-drawer';
import LeftPanelView from './LeftPanelView'
import tweens from './tweens'

export default class LeftDrawerComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            drawerType: 'static',
            openDrawerOffset:100,
            closedDrawerOffset:0,
            panOpenMask: .1,
            panCloseMask: .9,
            relativeDrag: false,
            panThreshold: .25,
            tweenHandlerOn: false,
            tweenDuration: 350,
            tweenEasing: 'linear',
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

    tweenHandler(ratio){
        if(!this.state.tweenHandlerPreset){ return {} }
        return tweens[this.state.tweenHandlerPreset](ratio)
    }

    noopChange(){
        this.setState({
            changeVal: Math.random()
        })
    }

    render(){
        //左图
        let  controlPanel = <LeftPanelView closeDrawer={() => {
            this.drawer.close();
        }} />;

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