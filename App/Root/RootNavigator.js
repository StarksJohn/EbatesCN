/**
 * 根页面
 *    1. 初始化导航器（Navigator）
 *    2. 处理Android返回键事件处理
 */
import React, {Component} from 'react';
import {Navigator, StatusBar, StyleSheet, View, Platform, DeviceEventEmitter} from 'react-native';
import RootPagesContainer from '../Redux/Container/RootPagesContainer'
import BizToast from '../Comp/BizCommonComp/BizToast'

/**
 * 返回到指定页面
 * @param navigator this.props.navigator
 * @param pageName :eg RootPagesContainer
 */
export function popToDesignatedPage(navigator,routeName) {

    for (let i=0; i<navigator.getCurrentRoutes().length ;i++ ) {
        let route=navigator.getCurrentRoutes()[i];
        if (route.name === routeName) {
            navigator.popToRoute(route);
            return ;
        }
    }
}

/**
 * 目标route和当前route 在 路由栈里 距离几个route
 * @param navigator
 * @param routeName
 */
export function routeNumsFromCurrentRoutes(navigator,routeName) {

    let count=0;//routeName和当前场景的route 距离几个 route
    for (let i=navigator.getCurrentRoutes().length-1; i>=0 ;i-- ) {
        let route=navigator.getCurrentRoutes()[i];
        if (route.name === routeName) {
            return count;
        }
        count++;
    }
    return count;
}

/**
 * 类似 reading里的 app.js,GitHubPopular 里的 setup.js
 * 根导航页
 *//**/
export default class RootNavigator extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handlerConfigureScene = () => {

        if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
        } else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    }

    /**
     * 通用的页面跳转传递navigator和route给下个页面
     * @param route
     * @param navigator
     * @returns {XML}
     * @private
     */
    renderScene = (route, navigator) => {
        let Component = route.component;

        return (
            <Component navigator={navigator} route={route}/>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Navigator
                    ref={component => this.navigator = component}
                    initialRoute={
                    {
                        component: RootPagesContainer,
                        name:gRouteName.RootPagesContainer//'RootPagesContainer'
                    }
                    }
                    configureScene={this.handlerConfigureScene}
                    renderScene={this.renderScene}
                />
                <BizToast
                />
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});