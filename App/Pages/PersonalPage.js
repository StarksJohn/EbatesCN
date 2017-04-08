/**
 个人主页 PersonalPage
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'
import LogInPage from './LogInPage'
import BaseListComp from '../Comp/Base/BaseListComp'
import GlobalStyles from '../Global/GlobalStyles'

/**
 *  展示组件
 */
export class PersonalPage extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     isLogin: false,
        // };
    }

    componentDidMount() {

        const {dispatch} = this.props;
        // dispatch(getTitleBarTab());//dispatch 了一个 Thunk 函数作为 action, 获取首页的数据
    }

    componentWillUnmount() {
    }

    onLogin() {
        gUserDB.isLogin().then(
            (b) => {//已登录
                Log.log('PersonalPage onLogin 已登陆')
                // this.setState({
                //     isLogin: false
                // });
            },
            (e) => {//非登录状态
                // this.setState({
                //     isLogin: false
                // })

                gPopBackToRouteAfteRegisterOrLoginSuceess = gRouteName.RootPagesContainer;

                this.props.navigator.push({
                    component: LogInPage,
                    name: gRouteName.LogInPage//'

                });
            }
        ).catch((error) => {
            Log.log('TokenAPI getTokenWhenAppOpen error= ' + error);
        });
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        switch (rowID) {
            case '0': {
                return <View style={{alignItems: 'center', backgroundColor: Colors.white}}>
                    {BizViews.ebatesViews()}

                    {BizLogBt(() => this.onLogin(),
                        {
                            backgroundColor: Colors.appUnifiedBackColor,
                            disabled: false,
                            title: '登录/注册',
                            btStyle: {
                                marginTop: 16,
                                width: 230,
                                height: 44,
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 20
                            }
                        })}
                </View>
            }
                break;
            case '1'://查看收益明细
            {
                return <View style={{
                     justifyContent: 'center',
                    height: 65, backgroundColor: Colors.BizCommonGrayBack
                }}>
                    {BizViews.renderTitleAndRightArrowCellBt(
                        () => {

                        },
                        '查看收益明细',false
                    )}
                </View>
            }
                break;
            case '2'://返利收益记录
            {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    },
                    '返利收益记录',true
                )
            }
                break;
            case '3'://收取提现历史
            {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    },
                    '收取提现历史',true
                )
            }
                break;
            case '4'://邀请好友送$5
            {
                return BizViews.renderTitleAndRightArrowCellBt(
                    () => {

                    },
                    '邀请好友送$5',false
                )
            }
                break;
            case '5'://应用设置
            {
                return <View style={{
                    justifyContent: 'center',
                    height: 65, backgroundColor: Colors.BizCommonGrayBack
                }}>
                    {BizViews.renderTitleAndRightArrowCellBt(
                        () => {

                        },
                        '应用设置',false
                    )}
                </View>
            }
                break;
        }
        return <View style={{height: 100, backgroundColor: Colors.getRandomColor()}}>

        </View>
    }

    render() {
        const {navigator} = this.props;

        let navigationBar = BizViews.renderBaseNavigationBar(null, null /*NavBarButton.getBackButton(() =>
         baseOnBackPress(navigator, this.backAndroidEventListener))*/, null, null, '我的账户', {}, {});

        return (
            <View style={styles.container}>
                {navigationBar}
                {BizViews.renderShadowLine()}
                <BaseListComp
                    renderRow={
                        this.renderRow
                    }
                    customContainer={{paddingBottom: GlobalStyles.bottomTabBarHeight}}
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
    const {PersonalPageReducer}=state;
    return {baseReducer: PersonalPageReducer};
}
export default connect(mapStateToProps)(PersonalPage);