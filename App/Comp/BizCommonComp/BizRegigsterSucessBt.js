/**
 * Created by Ebates on 16/12/29.
 *
 * 注册功能 白框 按钮
 */
import React from 'react';
import {View, Text} from 'react-native';
import Colors from '../../Utils/Colors'
import BaseTitleBt from '../Base/BaseTitleBt'

export default function BizRegigsterSucessBt(callback, props) {
    return (
        <View style={{
            width: 280, height: 180, alignItems: 'center',
            backgroundColor: Colors.white, borderRadius: 5
        }}
        >
            <Text style={{
                color: 'rgba(64, 64, 64, 1)', fontSize: 18, marginTop: 30,
                //backgroundColor: Colors.getRandomColor()
            }}
            >
                恭喜您注册成功
            </Text>
            <Text style={{
                color: 'rgba(85, 85, 85, 1)', fontSize: 14, marginTop: 10, width: 200, textAlign:'center', lineHeight:20,
                //backgroundColor: Colors.getRandomColor()
            }}
            >
                注册奖励的
                <Text style={{
                    color: 'rgba(255, 115, 12, 1)',
                    //backgroundColor: Colors.getRandomColor()
                }}
                >
                    5美金
                    <Text style={{
                        color: 'rgba(85, 85, 85, 1)',
                        //backgroundColor: Colors.getRandomColor()
                    }}
                    >
                        已添加到您的Ebates账户!
                    </Text>
                </Text>
            </Text>
            <BaseTitleBt
                btStyle={{
                    borderRadius: 4,
                    borderWidth: 0.5,
                    borderColor: Colors.appUnifiedBackColor,
                    width: 230,height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
                    marginTop: 15
                }}
                onPress={callback}
                textStyle={{
                    fontSize: 15,
                    //fontFamily: 'Gill Sans',
                    color: Colors.appUnifiedBackColor,
                }}
                title='马上开启海淘之旅!'
            >
            </BaseTitleBt>
        </View>
    );
}