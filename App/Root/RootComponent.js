/**
 * Created by Ebates on 17/1/4.
 *
 * 跟组件,用于 左图 切换 不同的 navs
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux'
import LeftDrawerComponent from './LeftDrawerComponent/LeftDrawerComponent'
import *as TokenAPI from '../NetWork/API/TokenAPI'
import BizLoadingView from '../Comp/BizCommonComp/BizLoadingView'
import BizToast from '../Comp/BizCommonComp/BizToast'

export class RootComponent extends Component {
    componentDidMount() {

        TokenAPI.getTokenWhenAppOpen();
    }

    componentWillUnmount() {
        // Log.log('componentWillUnmount');
    }

    render() {
        let Component = this.props.RootComponentReducer.curNav;

        return (
            <View style={{flex: 1}}>
                <LeftDrawerComponent
                >
                    {/*左屏的 子节点 就是 左屏里 切换  的不同的 nav*/}
                    <Component />
                </LeftDrawerComponent>
                {/*放到LeftDrawerComponent外部,避免打开左屏时,提示view显示位置不对*/}
                <BizToast
                />
                <BizLoadingView
                />
            </View>

        );
    }
}

function mapStateToProps(state) {

    // 把 state里的 RootComponentReducer 注入到 this.props里
    const {RootComponentReducer}=state;
    return {RootComponentReducer};
}

export default connect(mapStateToProps)(RootComponent)


