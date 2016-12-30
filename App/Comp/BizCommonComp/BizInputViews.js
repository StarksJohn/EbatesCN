/**
 * Created by Ebates on 16/12/30.
 *
 * 业务逻辑通用的 输入框view
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Image, Platform} from 'react-native';
import GlobalStyles from '../../Global/GlobalStyles'
import Colors from '../../Utils/Colors'
import BaseImgBt from '../Base/BaseImgBt'

/*邮箱输入框的容器view*/
export function emailInputView(styles, updateEmailCallBack) {
    return (
        <View style={[GlobalStyles.InputItemContainer, {marginTop: 40}]}>
            <View style={GlobalStyles.IpputItemLeftView}>
                <Text style={{}}>邮箱</Text>
            </View>
            <View style={GlobalStyles.InputItemRightView}>
                <TextInput
                    style={GlobalStyles.textInput}
                    autoFocus={false}
                    placeholder='输入邮箱地址'
                    onChange={
                        //(event) => this.updateEmail(event.nativeEvent.text)
                        updateEmailCallBack
                    }
                    //onBlur={() => this.onBlur()}
                    underlineColorAndroid={'transparent'}
                />
            </View>

        </View>
    );
}

/*密码输入框的容器view*/
export function passInputView(styles,updatePasswordCallBack) {
    return (
        <View style={[GlobalStyles.InputItemContainer]}>
            <View style={GlobalStyles.IpputItemLeftView}>
                <Text style={{}}>密码</Text>
            </View>
            <View style={GlobalStyles.InputItemRightView}>
                <TextInput
                    style={GlobalStyles.textInput}
                    placeholder='输入至少6位字符或数字'
                    onChange={
                        //(event) => this.updatePassword(event.nativeEvent.text)
                        updatePasswordCallBack
                    }
                    //onBlur={() => this.onBlur()}
                    underlineColorAndroid={Colors.transparent}
                />
            </View>
        </View>
    );
}

/*图片验证码 输入框的容器view*/
export function imgOauthCodeInputView(styles,updateImgOauthCodeCallBack,uri,updateImgCallBack) {
    return (
        <View style={[GlobalStyles.InputItemContainer]}>
            <View style={[GlobalStyles.IpputItemLeftView, {paddingRight: 16}]}>
                <Text style={{}}>验证码</Text>
            </View>
            <View style={[GlobalStyles.InputItemRightView, {
                //flexDirection: 'row',
                //alignItems: 'center',
                //justifyContent: 'space-between'
            }]}>
                <TextInput
                    style={GlobalStyles.textInput}
                    placeholder='输入图片验证码'
                    onChange={
                        //(event) => this.updateImgOauthCode(event.nativeEvent.text)
                        updateImgOauthCodeCallBack
                    }
                    //onBlur={() => this.onBlur()}
                    underlineColorAndroid={Colors.transparent}>
                </TextInput>
            </View>
            {/*图片按钮*/}
            <BaseImgBt
                btStyle={{
                    //height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
                }}
                imgStyle={{width: 110, height: 35,
                    //backgroundColor:Colors.getRandomColor()
                }}
                uri={
                    //this.props.LogInReducer.oauthCodeImgUri
                    uri
                }
                onPress={
                    //()=>this.getOauthCodeImg()
                    updateImgCallBack
                }
            >
            </BaseImgBt>
        </View>
    );
}

//邀请码输入view
export function InviteCodeInputView(styles,updateInviteCodeCallBack) {
    return (
        <View style={[GlobalStyles.InputItemContainer]}>
            <View style={[GlobalStyles.IpputItemLeftView, {paddingRight: 16}]}>
                <Text style={{}}>邀请码</Text>
            </View>
            <View style={GlobalStyles.InputItemRightView}>
                <TextInput
                    style={GlobalStyles.textInput}
                    placeholder='输入好友邀请码 (选填)'
                    onChange={
                        //(event) => this.updateInviteCode(event.nativeEvent.text)
                        updateInviteCodeCallBack
                    }
                    //onBlur={() => this.onBlur()}
                    underlineColorAndroid={Colors.transparent}
                />
            </View>
        </View>
    );
}
