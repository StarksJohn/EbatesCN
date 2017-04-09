/**
 * Created by Ebates on 2017/4/9.
 * SettingPage.js 应用设置 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import BaseListComp from '../Comp/Base/BaseListComp'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import BaseBt from '../Comp/Base/BaseBt'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import *as HttpCacheSizeAction from '../Redux/Actions/HttpCacheSizeAction'
import FeedbackPage from './FeedbackPage'

/**
 *  展示组件
 */
export class SettingPage extends Component {
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
        let self = this;
        HttpCacheSizeAction.getHttpCacheSizeAction().then(function (value) {
            Log.log('SettingPage  componentDidMount value=' + value);
            Log.log('SettingPage  componentDidMount self.props.baseReducer.ApiName=' + self.props.baseReducer.ApiName);

            self.props.dispatch(HttpCacheSizeAction.sendHttpCacheSizeAction(value, self.props.baseReducer.ApiName));
        })
    }

    componentWillUnmount() {
    }

    clearCache()
    {
        let self = this;

        if (HttpCacheSizeAction.clearCache()){
            HttpCacheSizeAction.getHttpCacheSizeAction().then(function (value) {
                Log.log('SettingPage  componentDidMount value=' + value);
                Log.log('SettingPage  componentDidMount self.props.baseReducer.ApiName=' + self.props.baseReducer.ApiName);

                self.props.dispatch(HttpCacheSizeAction.sendHttpCacheSizeAction(value, self.props.baseReducer.ApiName));
            })
        }
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        let self=this;
        switch (rowID) {
            case '0': {
                return <View style={{height: 55, backgroundColor: Colors.BizCommonGrayBack}}>
                    <BaseBt style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10, height: 45,
                        alignItems: 'center',
                        backgroundColor: Colors.white
                    }}
                            activeOpacity={0.6}
                            onPress={ () => {
                                self.clearCache();
                            } }
                    >
                        <Text style={{
                            fontSize: 15,
                            color: Colors.blackText,
                            marginTop: 0,
                            marginLeft: 15,
                            //backgroundColor: Colors.getRandomColor()
                        }}>
                            清空缓存 </Text>
                        {/*缓存大小*/}
                        <Text style={{
                            fontSize: 12,
                            color: Colors.backPopBtColor,
                            marginTop: 0,
                            marginRight: 15,
                            //backgroundColor: Colors.getRandomColor()
                        }}>

                            {rowData}

                        </Text>
                    </BaseBt>
                    { BizViews.renderShadowLine({
                        position: 'absolute', bottom: 0.0, left: 15, right: 0,
                        height: 0.5,
                        borderWidth: 0.0,
                        shadowOffset: {width: 0.0, height: 0.0},
                        backgroundColor: '#E4E4E4'
                    })}
                </View>
            }
                break;
            case '1': {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {
                        self.props.navigator.push({
                            component: FeedbackPage,
                            name: gRouteName.FeedbackPage//'

                        });
                    }, '反馈意见', true
                )
            }
                break;
            case '2': {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    }, '联系客服', false
                )
            }
                break;
            case '3': {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    }, '给应用打分', true, {marginTop: 10}
                )
            }
                break;
            case '4': {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    }, '关于Ebates.cn', false
                )
            }
                break;
            case '5': {
                return <View style={{alignItems: 'center'}}>
                    {BizLogBt(() => gUserDB.logOut(),
                        {
                            backgroundColor: Colors.transparent,
                            disabled: false,
                            title: '退出当前账号',
                            btStyle: {
                                marginTop: 20,
                                width: 170,
                                height: 44,
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 0,
                                borderColor: 'rgba(61, 165, 72, 1)',
                                borderWidth: 0.5, borderRadius: 4,
                            },
                            textStyle: {
                                color: 'rgba(61, 165, 72, 1)'  //
                            }
                        })}
                </View>
            }
                break;
        }

        return <View style={{height: 55, backgroundColor: Colors.BizCommonGrayBack}}>
        </View>

    }

    render() {
        const {navigator} = this.props;

        let navigationBar =
            <BaseNavigationBar
                style={ [{backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#E4E4E4'}] }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                searchBar={null}
                hide={false}
                title='应用设置'
                titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
            />;

        return (
            <View style={styles.container}>
                {navigationBar}
                <BaseListComp
                    renderRow={
                        this.renderRow
                    }
                    //customContainer={{paddingBottom: GlobalStyles.bottomTabBarHeight}}
                    {...this.props }
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: Colors.BizCommonGrayBack,
    },
});

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {SettingPageReducer}=state;
    return {baseReducer: SettingPageReducer};
}
export default connect(mapStateToProps)(SettingPage);
