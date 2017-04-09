/**
 * Created by Ebates on 16/12/21.
 *
 * 业务逻辑需要的 登录注册按钮
 */
import React from 'react';
import BaseTitleBt from '../Base/BaseTitleBt'
import Colors from '../../Utils/Colors';

export default function logBt(callback,props) {
    if (!props.textStyle){
        props.textStyle={}
    }
    return (
        <BaseTitleBt
            btStyle={[{
                borderRadius: 4,
                height: 44,
                alignItems: 'center',
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'center',
                backgroundColor: props.backgroundColor,
                marginTop: 15
            },props.btStyle]}
            onPress={callback}
            textStyle={[{
                fontSize: 15,
                color: Colors.white,
            },props.textStyle]}
            title={props.title}
            disabled={props.disabled}
        >
        </BaseTitleBt>
    );
}
