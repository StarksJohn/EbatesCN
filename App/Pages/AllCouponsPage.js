/**
 * Created by Ebates on 2017/4/1.
 * AllCouponsPage.js
 * 全部优惠 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image, Animated} from 'react-native';
import {connect} from 'react-redux'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import Colors from '../Utils/Colors';
import SearchPage from './SearchPage'
import GlobalStyles from '../Global/GlobalStyles'
import BaseImgBt from '../Comp/Base/BaseImgBt'

//改变 全部优惠页 导航栏title的 事件名
export const AllCouponPageChangeTitleEventName='AllCouponPageChangeTitleEventName';

export class AllCouponsPage extends Component {
    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.AllCouponsPage
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    onSearch() {
        this.props.navigator.push({
            component: SearchPage,
            name: gRouteName.SearchPage,
            isInTwoLevelPage: true,
        });
    }

    render() {

        Log.log('AllCouponsPage render');
        let self = this;

        const {navigator} = this.props;
        let rightBt = <BaseImgBt
            btStyle={{
                height: 35, width: 35, alignItems: 'center',
                justifyContent: 'center', marginRight: 5,
                //backgroundColor: Colors.getRandomColor(),
            }}
            imgStyle={{
                width: 20, height: 20,
                //backgroundColor:Colors.getRandomColor()
            }}
            localPath={require('../Img/search.png')}
            onPress={
                () => this.onSearch()
            }
        >
        </BaseImgBt>

        let navigationBar =<BaseNavigationBar
            style={ [{backgroundColor: Colors.white},{zIndex: 2}] }
            statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
            titleTextView={null}
            leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
            rightButton={rightBt}
            searchBar={null}
            hide={false}
            title='全部优惠'
            changeTitleEventName={AllCouponPageChangeTitleEventName}
            titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
        />;

        return (
            <View style={{flex: 1, backgroundColor: Colors.BizCommonGrayBack,}}>

                {navigationBar}
                {BizViews.renderShadowLine({zIndex: 3, borderWidth: 0.3})}

            </View>
        );
    }

}


//
function mapStateToProps(state) {

    // 把 state里的 xxx 注入到 this.props里
    const {AllMerchantPageReducer}=state;
    return {baseReducer: AllMerchantPageReducer};
}

export default connect(mapStateToProps)(AllCouponsPage)