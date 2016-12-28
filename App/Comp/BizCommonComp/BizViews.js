/**
 * Created by Ebates on 16/12/26.
 *
 * 业务逻辑层可共用的view
 */
import React from 'react';
import {View,Image ,Text} from 'react-native';
import Colors from '../../Utils/Colors'
import FontAwesomeIconBts from '../Base/BaseFontAwesomeIconBts'

/**
 * 登录注册页共用
 * @returns {XML}
 */
export function ebatesViews() {
    let str = '返利高 商家全 折扣大 提现快';
    return (
        <View style={{
            alignItems: 'center',
            backgroundColor: Colors.getRandomColor()
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
