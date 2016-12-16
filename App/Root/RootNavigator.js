/**
 * 根页面
 *    1. 初始化导航器（Navigator）
 *    2. 处理Android返回键事件处理
 */
import React, {Component} from 'react';
import {Navigator, StatusBar, StyleSheet, View, Platform, DeviceEventEmitter} from 'react-native';
import RootPagesContainer from '../Redux/Container/RootPagesContainer'
import BizToast from '../Comp/BizToast'

/**
 * 类似 reading里的 app.js,GitHubPopular 里的 setup.js
 * 根导航页
 *//**/
class RootNavigator extends Component {

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
                        component: RootPagesContainer
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

export default RootNavigator;