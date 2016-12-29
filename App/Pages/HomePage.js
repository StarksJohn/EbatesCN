/**
 首页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text,InteractionManager} from 'react-native';
// import {getTitleBarTab} from '../actions/titleBarTab';
// import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
// import RecommendedFoodListContanier from '../containers/RecommendedFoodListContanier';
// import CollectedListContainer from '../containers/CollectedListContainer';
import Colors from '../Utils/Colors';
import  BaseNavigationBar ,{NavBarButton} from '../Comp/Base/BaseNavigationBar'
import *as GlobalConst from '../Global/GlobalConst'
import LogInPage from './LogInPage'
import *as Token from '../NetWork/API/Token'

/**
 *  展示组件
 */
class HomePage extends Component {

    constructor(props) {
        super(props);

        // this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
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
    onBarsPress() {
        // showToast('onBarsPress');
        // InteractionManager.runAfterInteractions(() => {
        //     this.props.navigator.push({
        //         component: LogPage
        //     });
        // });

        this.props.navigator.push({
            component: LogInPage,
            name:gRouteName.LogInPage//'LogInPage'
        });

        // Token.getUnLoginToken();
    }

    render() {
        const {HomePageReducer, navigator} = this.props;

        var statusBar = {//外部自定义statusBar的属性
            backgroundColor: Colors.appUnifiedBackColor,
            networkActivityIndicatorVisible: true,
            barStyle: 'light-content'
        };
        let navigationBar =
            <BaseNavigationBar
                navigator={navigator}
                leftButton={NavBarButton.getBarsButton(()=>this.onBarsPress())}
                title={GlobalConst.AppName}
                style={{backgroundColor: Colors.appUnifiedBackColor}}
                statusBarCustomStyle={statusBar}
                hide={false}/>;


        // let content = <ScrollableTabView
        //     //page={0}
        //     renderTabBar={() =>
        //         <DefaultTabBar
        //             tabStyle={{paddingBottom: 0 /*为了 text 上下居中*/}}
        //             style={{height: 40 /*外部改变DefaultTabBar的高度 */}}
        //             underlineHeight={4}
        //             textStyle={{fontSize: 13}}
        //         />
        //     }
        //     tabBarBackgroundColor={Colors.appUnifiedBackColor}/*"#fcfcfc"*/ //整个tabbar的背景色
        //     tabBarUnderlineColor={Colors.white}
        //     tabBarActiveTextColor={Colors.white}
        //     tabBarInactiveTextColor={Colors.white}//"#aaaaaa"
        // >
        //
        //     {
        //         HomePageReducer.scrollTbvMenuTitles.map((v, i) => {
        //
        //             const list = (
        //                 <View
        //
        //
        //                     key={i}
        //                     tabLabel={v.value}/*有几个tabLabel,决定有几个tab*/
        //                     style={{flex: 1, backgroundColor: 'yellow'}}
        //                 >
        //
        //                     {
        //                         (this.getHomePageListContanier(i, v.listApiTag, navigator))
        //
        //                     }
        //
        //                 </View> );
        //             return list;
        //         })
        //     }
        //
        //
        // </ScrollableTabView>;

        return (
            <View style={styles.container}>
                {navigationBar}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: Colors.getRandomColor(),
    },
});

export default HomePage;
