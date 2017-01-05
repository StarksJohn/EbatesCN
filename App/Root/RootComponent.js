/**
 * Created by Ebates on 17/1/4.
 *
 * 跟组件
 */
import React, {Component} from 'react';
import {} from 'react-native';
import {connect} from 'react-redux'
import LeftDrawerComponent from './LeftDrawerComponent/LeftDrawerComponent'

export  class RootComponent extends Component {

    render() {
        let Component = this.props.RootComponentReducer.curNav;

        return (
            <LeftDrawerComponent
            >
                {/*左屏的 子节点 就是 左屏里 切换  的不同的 nav*/}
                <Component />
            </LeftDrawerComponent>
        );
    }
}

function mapStateToProps(state) {

    // 把 state里的 RootComponentReducer 注入到 this.props里
    const {RootComponentReducer}=state;
    return {RootComponentReducer};
}

export default connect(mapStateToProps)(RootComponent)

