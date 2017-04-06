/**
 * Created by Ebates on 16/12/26.
 *  BizViews
 * 业务逻辑层可共用的view
 */
import React from 'react';
import {View, Image, Text} from 'react-native';
import Colors from '../../Utils/Colors'
import FontAwesomeIconBts from '../Base/BaseFontAwesomeIconBts'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BaseSpeLine from '../Base/BaseSpeLine'
import BaseTitleBt from '../Base/BaseTitleBt'
import BaseSearchBar from '../Base/BaseSearchBar/BaseSearchBar'
import BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Base/BaseNavigationBar'


/**
 * 登录注册页共用
 * @returns {XML}
 */
export function ebatesViews() {
    let str = '返利高 商家全 折扣大 提现快';
    return (
        <View style={{
            alignItems: 'center',
            backgroundColor: Colors.white
        }}>
            <Image source={require('../../Img/common_icon_logo.png')} style={{marginTop: 20}}/>
            <Text style={{
                marginTop: 15, fontSize: 18, fontWeight: 'bold', color: 'rgba(255, 115,' +
                ' 12, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>全球领先的返利网站</Text>
            <Text style={{
                marginTop: 8, fontSize: 12, color: 'rgba(136, 136, 136, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>{str}</Text>
        </View>
    );
}

/**
 * 分割线
 * @returns {*}
 */
export function baseSpeLine(props) {
    return (
        BaseSpeLine.baseSpeLine(props)
    );
}

/**
 * 勾选框
 * @returns {XML}
 */
export function checkBox(callBack) {
    return <FontAwesomeIconBts
        btStyle={{
            width: 30,
            height: 30,
            /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginLeft: 15,
            //backgroundColor:Colors.green
        }}
        //btSelectColor={Colors.blackTranslucent}
        normalName='square'
        selectName='check-square'
        iconSize={25}
        initSelected={true}
        iconColor={Colors.appUnifiedBackColor}
        onPress={callBack}
    />
}

/**
 * 删除按钮
 * @param callBack
 * @returns {XML}
 */
export function deleteBox(callBack) {
    return <FontAwesomeIconBts
        btStyle={{
            width: 30,
            height: 30,
            /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginRight: 5,
            //backgroundColor:Colors.getRandomColor()
        }}
        normalName='close'
        selectName='close'
        iconSize={15}
        initSelected={false}
        iconColor={Colors.borderColor}
        onPress={callBack}
    />
}

/**
 * 列表最底部 用于 tabbar 的 占位view, 为了 footerview 能显示在 底部tabbar上边
 * isInTwoLevelPage: 二级页面底部不显示
 */
export function renderBottomTabbarBackView(isInTwoLevelPage) {
    return <View style={{
        height: isInTwoLevelPage ? 0 : GlobalStyles.bottomTabBarHeight,
        //backgroundColor: Colors.getRandomColor()
    }}>
    </View>;
}

/**
 * 画 带阴影的 线 ,横竖线 都能画, props里可用 position: 'absolute' 控制,如 商家详情页底部的bar
 * 画 不带阴影的分割线, 外部传
 *  {position: 'absolute', bottom:0.0, left:15, right:15,
                        height:0.5,borderWidth:0.0,shadowOffset: {width: 0.0, height: 0.0}, backgroundColor: '#E4E4E4'}
 * @returns {XML}
 */
export function renderShadowLine(props) {
    return <View style={[{
        height: 0.5, borderWidth: 0.5,
        borderColor: '#E4E4E4',//'rgba(228, 228, 228, 1)', //Colors.getRandomColor(),//,//'#dddddd',
        borderStyle: null,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,

    }, props]}>
    </View>
}

/**
 * 搜索结果页 商家和优惠列表 无数据的 共用 view
 * @param keyWord 关键词
 * @param type 0:商家 1:优惠
 * @param callback 点击按钮回调
 * @returns {XML}
 */
export function renderSearchResultPageNoDataView(keyWord, type, callback) {
    let merchantOrCouponKeyWord = (type == 0 ? '商家' : '优惠');
    let bigText = '抱歉! 目前没有搜索到和' + keyWord + '相关的' + merchantOrCouponKeyWord + '!';
    let smallText = '您可以重新搜索,  发现感兴趣的' + merchantOrCouponKeyWord + '.';
    let btTitle = '查看全部' + merchantOrCouponKeyWord;
    return (
        <View style={{
            flex: 1, alignItems: 'center',
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Image source={require('../../Img/common_icon_noresult.png')} style={{marginTop: 60}}/>
            <Text style={{
                marginTop: 30, fontSize: 15, color: 'rgba(64, 64,' +
                ' 64, 1)',
                // backgroundColor:Colors.getRandomColor()
            }}>{bigText}</Text>
            <Text style={{
                marginTop: 15, fontSize: 12, color: 'rgba(136, 136, 136, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>{smallText}</Text>
            <BaseTitleBt
                key={merchantOrCouponKeyWord}
                btStyle={[{
                    width: 170, height: 44,
                    borderRadius: 4, borderColor: 'rgba(54, 166, 66, 1)', borderWidth: 0.5, marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.transparent,
                }]}
                onPress={callback}
                textStyle={{
                    fontSize: 15,
                    color: 'rgba(54, 166, 66, 1)',
                }}
                title={btTitle}
                disabled={false}
            >
            </BaseTitleBt>
        </View>
    );
}

/**
 * 全部商家 页 筛选无结果 时 显示 的 视图
 * @param keyWord
 * @param type
 * @param callback
 * @returns {XML}
 */
export function renderAllmerchantPageNoDataView(  callback) {
    let bigText = '抱歉! 目前没有满足此过滤条件的商家 !' ;
    let smallText = '您可以重新筛选, 发现感兴趣的商家. ';
    let btTitle = '查看全部商家';
    return (
        <View style={{
            flex: 1, alignItems: 'center',
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Image source={require('../../Img/common_icon_noresult.png')} style={{marginTop: 60}}/>
            <Text style={{
                marginTop: 30, fontSize: 15, color: 'rgba(64, 64,' +
                ' 64, 1)',
                // backgroundColor:Colors.getRandomColor()
            }}>{bigText}</Text>
            <Text style={{
                marginTop: 15, fontSize: 12, color: 'rgba(136, 136, 136, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>{smallText}</Text>
            <BaseTitleBt
                key={btTitle}
                btStyle={[{
                    width: 170, height: 44,
                    borderRadius: 4, borderColor: 'rgba(54, 166, 66, 1)', borderWidth: 0.5, marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.transparent,
                }]}
                onPress={callback}
                textStyle={{
                    fontSize: 15,
                    color: 'rgba(54, 166, 66, 1)',
                }}
                title={btTitle}
                disabled={false}
            >
            </BaseTitleBt>
        </View>
    );
}

/**
 * 全部优惠 页 筛选无结果 时 显示 的 视图
 * @param keyWord
 * @param type
 * @param callback
 * @returns {XML}
 */
export function renderAllCouponPageNoDataView( callback) {
    let bigText = '抱歉! 目前没有满足此过滤条件的优惠 !' ;
    let smallText = '您可以重新筛选, 发现感兴趣的优惠. ';
    let btTitle = '查看全部优惠';
    return (
        <View style={{
            flex: 1, alignItems: 'center',
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Image source={require('../../Img/common_icon_noresult.png')} style={{marginTop: 60}}/>
            <Text style={{
                marginTop: 30, fontSize: 15, color: 'rgba(64, 64,' +
                ' 64, 1)',
                // backgroundColor:Colors.getRandomColor()
            }}>{bigText}</Text>
            <Text style={{
                marginTop: 15, fontSize: 12, color: 'rgba(136, 136, 136, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>{smallText}</Text>
            <BaseTitleBt
                key={btTitle}
                btStyle={[{
                    width: 170, height: 44,
                    borderRadius: 4, borderColor: 'rgba(54, 166, 66, 1)', borderWidth: 0.5, marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.transparent,
                }]}
                onPress={callback}
                textStyle={{
                    fontSize: 15,
                    color: 'rgba(54, 166, 66, 1)',
                }}
                title={btTitle}
                disabled={false}
            >
            </BaseTitleBt>
        </View>
    );
}

/**
 * 竖线
 * @returns {XML}
 * @constructor
 */
export function renderVerticalLine(styles) {
    return <Text style={[{
        marginLeft: 0, marginTop: 0, fontSize: 10, color: 'rgba(228, 228,' +
        ' 228, 1)', textAlign: "center", alignSelf: 'center',
        //backgroundColor: Colors.getRandomColor()
    }, styles]} numberOfLines={1}>
        |
    </Text>;
}

/**
 * 画一级页面的 搜索控件
 * @param placeholder
 * @param value
 * @param onSubmitCallback
 * @returns {XML}
 */
export function renderFirstLevelPageSearchBar(placeholder, onSubmitCallback) {
    return <BaseSearchBar ref="refBaseSearchBar"
                          placeholder={placeholder}
                          onSubmit={(value) => onSubmitCallback(value)
                          }
                          customInputStyle={{color: 'rgba(64, 64, 64, 1)', fontSize: 15}}
    />;
}

/**
 * 画二级页面的 搜索控件
 * @param placeholder
 * @param value
 * @param onSubmitCallback
 * @returns {XML}
 */
export function renderTwoLevelPageSearchBar(placeholder, value, onSubmitCallback) {
    return <BaseSearchBar
        ref="refBaseSearchBar" placeholder={placeholder} value={value}
        onSubmit={(value) => onSubmitCallback(value)
        }
        customContainerStyle={{paddingLeft: 10}}
        customInputStyle={{color: 'rgba(64, 64, 64, 1)', fontSize: 15}}
        customSearchStyle={{left: 16}}
        defaultPaddingRight={50}
        onFocusPaddingRight={37}
    />;
}

/**
 * 画 导航栏
 * @param titleTextView 外部自定义的 titleView
 * @param leftButton
 * @param rightButton
 * @param searchBar
 * @param title
 * @param titleTextStyle 默认是 GlobalStyles.navBarTitleTextStyle,外部若不想改默认的,可传 {}
 * containerStyle: 容器的style
 * @returns {XML}
 */
export function renderBaseNavigationBar(titleTextView, leftButton, rightButton, searchBar, title, titleTextStyle, containerStyle) {
    return <BaseNavigationBar
        style={ [{backgroundColor: Colors.white},containerStyle] }
        statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
        titleTextView={titleTextView}
        leftButton={leftButton}
        rightButton={rightButton}
        searchBar={searchBar}
        hide={false}
        title={title}
        //changeTitleEventName={changeTitleEventName}
        titleTextStyle={[GlobalStyles.navBarTitleTextStyle, titleTextStyle]}
    />;
}

/**
 * 网络异常view
 * @param contanierStyle
 * @param ImageStyle
 * @param TextStyle
 * @param BaseTitleBtStyle
 * @returns {XML}
 */
export function netWorkAbnormalView(contanierStyle, ImageStyle, TextStyle, BaseTitleBtStyle, onPress) {
    return <View style={[{
        alignSelf: 'center', //height: 180,flex: 1,
        justifyContent: 'center', alignItems: 'center',
        //backgroundColor:Colors.getRandomColor()
    }, contanierStyle]}>
        <Image source={require('../../Img/common_bkg_error@3x.png')}
               style={[{
                   width: 60, height: 60, marginTop: 0,
                   //backgroundColor:Colors.getRandomColor()
               }, ImageStyle]}/>
        <Text style={[{
            marginLeft: 0,
            marginTop: 10,
            fontSize: 14,
            color: '#404040',
            //alignSelf: 'center',
            //backgroundColor: Colors.getRandomColor()
        }, TextStyle]} numberOfLines={1} textAlign="center"
        >网络异常,请点击屏幕重试</Text>
        <BaseTitleBt
            key={1}
            btStyle={[{
                width: 140,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                borderColor: 'rgba(54, 166,' +
                ' 66, 1)',
                borderWidth: 0.5,
                marginTop: 10,
                backgroundColor: Colors.transparent,
            }, BaseTitleBtStyle]}
            onPress={() => {
                //this.BaseGridViewRef.fetchData();
                onPress();
            }}
            textStyle={{
                fontSize: 15,
                color: 'rgba(54, 166, 66, 1)',
            }}
            title='重新加载'
            disabled={false}
        >
        </BaseTitleBt>

    </View>
}

/**
 * 画 徽章
 * @param containerStyle
 * @param text
 */
export function renderBadge(containerStyle, textStyle, text) {
    return <View style={[{alignItems: 'center', justifyContent: 'center'}, containerStyle]}>
        <Text style={textStyle}>
            {text}
        </Text>
    </View>;
}