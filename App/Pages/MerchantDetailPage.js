/**
 * Created by Ebates on 17/3/13.
 * 商家详情页 MerchantDetailPage
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'


export class MerchantDetailPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.SearchResultPage
            });
        }
    }

    componentDidMount() {

    }

    render() {
        const {navigator} = this.props;

        let navigationBar =
            <BaseNavigationBar
                style={ {backgroundColor: Colors.getRandomColor() } }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getMerchantDetailPageBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                rightButton={NavBarButton.getMerchantDetailRightBt(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                hide={false}/>;

        return (
            <View style={[GlobalStyles.pageContainer,{backgroundColor:Colors.BizCommonGrayBack}]}>
                {navigationBar}
            </View>
        );
    }

}

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {MerchantPageReducer}=state;
    return {baseReducer: MerchantPageReducer};
}
export default connect(mapStateToProps)(MerchantDetailPage);