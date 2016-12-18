/**
 登录注册 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
// import {getTitleBarTab} from '../actions/titleBarTab';
// import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
// import RecommendedFoodListContanier from '../containers/RecommendedFoodListContanier';
// import CollectedListContainer from '../containers/CollectedListContainer';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/BackAndroidEventListener'
import *as LogRegisterPageActions from '../Redux/Actions/LogRegisterPageActions'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

/**
 *  展示组件
 */
export default class LogRegisterPage extends Component {

    constructor(props) {
        super(props);
        this.backAndroidEventListener = new BackAndroidEventListener({...props, backPress: (e)=>this.onBackPress()});

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
        this.backAndroidEventListener.addEventListener();
        dispatch(LogRegisterPageActions.getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据

    }

    componentWillUnmount() {
        // BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
        this.backAndroidEventListener.removeEventListener();

        // this.context.removeBackButtonListener(this.onBackButton);
    }

    // getHomePageListContanier(i,
    //                          listApiTag,
    //                          navigator) {
    //     switch (i) {
    //         case  0: {
    //             return (
    //                 <RecommendedFoodListContanier
    //                     listApiTag={listApiTag}
    //                     navigator={navigator}
    //                 />
    //             );
    //         }
    //             break;
    //         case 1: {
    //             return (
    //                 <CollectedListContainer
    //                     listApiTag={listApiTag}
    //                     navigator={navigator}
    //                 />
    //             );
    //         }
    //             break;
    //     }
    // };

    /*
     左上角点击
     */
    onBackPress() {
        this.props.navigator.pop();//app 页面回退
        return true;
    }

    render() {
        const {LogRegisterPageReducer, navigator} = this.props;

        var statusBar = {//外部自定义statusBar的属性
            backgroundColor: Colors.appUnifiedBackColor,
            networkActivityIndicatorVisible: true,
            barStyle: 'dark-content'
        };
        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBackButton(()=>this.onBackPress())}
                title='登录/注册'
                style={{backgroundColor: Colors.white}}
                titleTextStyle={{color: Colors.black}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;

        let ebatesView=
            <View style={{height:140, backgroundColor:'rgba(221, 221, 221, 1)'}}>

            </View>

        let content = <ScrollableTabView
            //page={0}
            renderTabBar={() =>
                <DefaultTabBar
                    tabStyle={{paddingBottom: 0 /*为了 text 上下居中*/}}
                    style={{height: 40 /*外部改变DefaultTabBar的高度 */}}
                    underlineHeight={2}
                    textStyle={{fontSize: 15 /*, color:Colors.black*/}}
                    activeTextColor={Colors.appUnifiedBackColor}
                />
            }
            tabBarBackgroundColor='rgba(237, 237, 237, 1)'/*"#fcfcfc"*/ //整个tabbar的背景色
            tabBarUnderlineColor={Colors.appUnifiedBackColor}
            tabBarActiveTextColor={Colors.appUnifiedBackColor}
            tabBarInactiveTextColor={Colors.black}//"#aaaaaa"
        >

            {
                LogRegisterPageReducer.scrollTbvMenuTitles.map((v, i) => {

                    const list = (
                        <View


                            key={i}
                            tabLabel={v}/*有几个tabLabel,决定有几个tab*/
                            style={{flex: 1, backgroundColor: Colors.getRandomColor()}}
                        >

                            {
                               // (this.getHomePageListContanier(i, v.listApiTag, navigator))

                            }

                        </View> );
                    return list;
                })
            }


        </ScrollableTabView>;

        return (
            <View style={styles.container}>
                {navigationBar}
                {ebatesView}
                {content}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

