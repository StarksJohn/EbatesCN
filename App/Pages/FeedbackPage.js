/**
 * Created by Ebates on 2017/4/9.
 * FeedbackPage.js 反馈意见 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, TextInput} from 'react-native';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import BizLogBt from '../Comp/BizCommonComp/BizLogBt'

export default class FeedbackPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.FeedbackPage
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
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
                title='反馈意见'
                titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
            />;

        return (
            <View style={styles.container}>
                {navigationBar}
                <TextInput
                    ref="searchInput"
                    placeholder='请输入您的反馈意见'
                    multiline={true}
                    placeholderTextColor='#C0C0C0'
                    secureTextEntry={true}
                    onChangeText={(value) => {

                    }}
                    style={{
                        marginTop: 15,
                        color: '#C0C0C0',
                        fontSize: 14,
                        paddingLeft: 10,
                        paddingTop: 8,
                        paddingRight: 8,
                        paddingBottom: 8,
                        marginLeft: 15,
                        width: gScreen.width - 30,
                        height: 145,
                        backgroundColor: Colors.white,
                        borderWidth: 1,
                        borderColor: Colors.commonBorderColor,
                    }}
                    editable={true}
                    onSubmitEditing={() => {

                    }}
                    clearButtonMode="never"
                    underlineColorAndroid="transparent"
                    selectionColor={Colors.appUnifiedBackColor}
                    //blurOnSubmit={true}
                    onFocus={() => {

                    }
                    }
                    onBlur={() => {
                    }
                    }

                />
                {BizLogBt(() => {

                    },
                    {
                        backgroundColor: Colors.appUnifiedBackColor,
                        disabled: false,
                        title: '提交',
                        btStyle: {
                            marginTop: 20,
                            width: gScreen.width-30,
                            height: 44,
                            marginLeft: 15,
                            marginRight: 0,
                            marginBottom: 0,
                            //borderColor: 'rgba(61, 165, 72, 1)',
                            //borderWidth: 0.5, borderRadius: 4,
                        },
                        textStyle: {
                            color: Colors.white , fontSize: 15 //
                        }
                    })}
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
