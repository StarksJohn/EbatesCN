/**
 * 跨平台的 根页面
 *    1. 实现一级主界面布局，底部 TabNavigator 切换一级页面的 Pgae的风格
 */
import React, {PropTypes} from 'react';
import {View, Text, StyleSheet, TabBarIOS, TouchableHighlight, ToastAndroid, Image} from 'react-native';
import {arrBottomTabInfo, switchBottomTabAction} from '../Redux/Actions/RootPageAction';
import TabNavigator from 'react-native-tab-navigator';
// const Ionicons = require('react-native-vector-icons/Ionicons');
// import {routes} from '../comp/Routes';
import {AllContainers, getOneContainer} from '../Redux/Container/AllPageContainers';
import Colors from '../Utils/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import {getRealmCachedSizeAction,sendCachedSizeAction} from '../actions/realmCachedSizeAction'
// import *as httpCacheSizeAction from '../actions/httpCacheSizeAction'
// import Log from '../utils/Log'


class RootPages extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        RootPageReducer: PropTypes.object.isRequired
    };

    render() {

        const {RootPageReducer, dispatch}=this.props;//从 this.props 里取出 RootPageReducer 属性
        //cp是个array,array元素是 TabNavigator.Item
        let cp = arrBottomTabInfo.map((v, i) => {
                let value = AllContainers[v];
                return <TabNavigator.Item
                    key={'TabNavigator.Item' + value.tabBarName}
                    selected={ RootPageReducer.tab === value.tabBarName}
                    title={value.tabBarName}
                    renderIcon={() => <Image source={value.requireNormalIcon}/>}
                    //renderIcon={ ()=> <FontAwesomeIcon name={value.iconName} size={23} color={Colors.textBlack}/>  }
                    renderSelectedIcon={() => <Image source={value.requireSelectIcon}/>}
                    //renderSelectedIcon={ ()=> <FontAwesomeIcon name={value.iconName} size={23}
                    // color={Colors.appUnifiedBackColor}/> }
                    badgeText={value.badgeText == '0' ? null : value.badgeText}
                    onPress={() => {
                        if (RootPageReducer.tab !== value.tabBarName) {
                            dispatch(switchBottomTabAction(value.tabBarName));
                            {/*if (value.tabBarName===AllContainers.PersonalPageContainer.tabBarName){*/
                            }

                            {/*httpCacheSizeAction.getHttpCacheSizeAction().then(function (value) {*/
                            }
                            {/*dispatch(httpCacheSizeAction.sendHttpCacheSizeAction(value));*/
                            }
                            {/*})*/
                            }
                            {/*}*/
                            }
                        }
                    }}
                    titleStyle={{color: Colors.textBlack /*, fontWeight: 'bold'*/}}/*item的 title的text 的 默认 style*/
                    selectedTitleStyle={{color: Colors.appUnifiedBackColor /*, fontWeight: 'bold'*/}} /*item的
                 title的text 的
                 选中状态 style*/
                >
                    {getOneContainer(this.props.navigator, value.comp)}
                </TabNavigator.Item>;
            }
        );
        return <TabNavigator
            tabBarStyle={{opacity: 0.8,}}
            sceneStyle={{paddingBottom: 0}}
        >{cp}</TabNavigator>
    }

}

// RootPages.propTypes = propTypes;

export default RootPages;


