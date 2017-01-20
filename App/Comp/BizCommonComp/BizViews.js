/**
 * Created by Ebates on 16/12/26.
 *  BizViews
 * 业务逻辑层可共用的view
 */
import React from 'react';
import {View,Image ,Text} from 'react-native';
import Colors from '../../Utils/Colors'
import FontAwesomeIconBts from '../Base/BaseFontAwesomeIconBts'
import GlobalStyles from '../../Global/GlobalStyles'
import *as BaseSpeLine from '../Base/BaseSpeLine'

/**
 * 登录注册页共用
 * @returns {XML}
 */
export function ebatesViews() {
    let str = '返利高 商家全 折扣大 提现快';
    return (
        <View style={{
            alignItems: 'center',
            //backgroundColor: Colors.getRandomColor()
        }}>
            <Image source={require('../../Img/common_icon_logo@2x.png')} style={{marginTop: 20}}/>
            <Text style={{
                marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'rgba(255, 115,' +
                ' 12, 1)',
                //backgroundColor:Colors.getRandomColor()
            }}>最好的海淘返利网站</Text>
            <Text style={{marginTop: 3, fontSize: 12, color: 'rgba(136, 136, 136, 1)'}}>{str}</Text>
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
    return<FontAwesomeIconBts
        btStyle={{
            width: 30,
            height: 30,
            /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginLeft: 15 ,
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
    return<FontAwesomeIconBts
        btStyle={{
            width: 30,
            height: 30,
            /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginRight: 5 ,
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
 */
export function renderBottomTabbarBackView() {
    return<View style={{height: GlobalStyles.bottomTabBarHeight ,
        //backgroundColor: Colors.getRandomColor()
    }}>
    </View>;
}

/**
 * 画 带阴影的 线
 * @returns {XML}
 */
export function renderShadowLine(props) {
    return <View style={[{
        height: 0.5, borderWidth:0.5, //backgroundColor: 'rgba(228, 228, 228, 1)',
        borderColor: 'rgba(228, 228, 228, 1)', //Colors.getRandomColor(),//,//'#dddddd',
        borderStyle: null,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
    },props]}>
    </View>
}