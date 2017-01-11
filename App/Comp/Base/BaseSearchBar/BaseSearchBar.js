/**
 * Created by Ebates on 17/1/10.
 * 借鉴 https://github.com/ant-design/ant-design-mobile/blob/master/docs/react/introduce.zh-CN.md#%E5%AE%89%E8%A3%85
 * 这个库的 源码
 */

import React from 'react';
import assign from 'object-assign';
import {View, TextInput, Text, Image, Animated, Easing} from 'react-native';
import {defaultProps} from './PropsType';
import styles from './style/index';
import Colors from '../../../Utils/Colors'
import BaseTitleBt from '../BaseTitleBt'


export default class BaseSearchBar extends React.Component {
    constructor(props) {
        super(props);

        //按下键盘右下角的 搜索按钮
        this.onSubmit = (e) => {
            e.preventDefault();
            if (this.props.onSubmit) {
                this.props.onSubmit(this.state.value);
            }

            this.refs.searchInput.blur();//主动失去光标焦点和 隐藏键盘
            this.setState({isShowCancelButton: false, paddingRight: 15});

            // this.closeAnimated();

        };
        this.onChangeText = (value) => {
            if (!('value' in this.props)) {
                this.setState({value});
            }
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };
        this.onCancel = () => {
            if (this.props.onCancel) {
                this.props.onCancel(this.state.value);
            }
            this.refs.searchInput.blur();//主动失去光标焦点和 隐藏键盘
            this.refs.searchInput.clear();//清除 text
            this.setState({isShowCancelButton: false, paddingRight: 15});

            // this.closeAnimated();


        };
        this.onFocus = () => {
            this.setState({isShowCancelButton: true, paddingRight: 0});

            // this.beginAnimated();
        };

        this.onBlur = () => {
            this.setState({isShowCancelButton: false});

            // this.closeAnimated();

        };

        let value;
        if ('value' in props) {
            value = props.value;
        }
        else if ('defaultValue' in props) {
            value = props.defaultValue;
        }
        else {
            value = '';
        }

        this.state = {
            value,
            isShowCancelButton: false,
             paddingRight:15 /*new Animated.Value(15)*/, /*一开始默认 容器view的 右 补白距离*/
            // cancleBtopacity: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    beginAnimated(){
        // Animated.timing(this.state.paddingRight, {
        //     toValue: 0, // 目标值
        //     duration: 100, // 动画时间
        //     easing: Easing.linear // 缓动函数
        // }).start();
        //
        // Animated.timing(this.state.cancleBtopacity, {
        //     toValue: 1, // 目标值
        //     duration: 500, // 动画时间
        //     easing: Easing.linear // 缓动函数
        // }).start();
    }

    closeAnimated(){
        // Animated.timing(this.state.paddingRight, {
        //     toValue: 15, // 目标值
        //     duration: 100, // 动画时间
        //     easing: Easing.linear // 缓动函数
        // }).start();
        //
        // Animated.timing(this.state.cancleBtopacity, {
        //     toValue: 0, // 目标值
        //     duration: 100, // 动画时间
        //     easing: Easing.linear // 缓动函数
        // }).start();
    }

    render() {
        const {showCancelButton, cancelText, disabled, styles} = this.props;
        const restProps = assign({}, this.props);
        [
            'showCancelButton', 'cancelText', 'styles', 'value', 'onChangeText', 'onSubmitEditing', 'disabled',
        ].forEach(prop => {
            if (restProps.hasOwnProperty(prop)) {
                delete restProps[prop];
            }
        });
        const {value} = this.state;

        let cancleBt = <BaseTitleBt
            btStyle={{
                width: 65, height: 32, alignItems: 'center', justifyContent: 'center',
                backgroundColor: Colors.white
            }}
            onPress={this.onCancel}
            textStyle={{
                fontSize: 16,
                //fontFamily: 'Gill Sans',
                color: Colors.black,
            }}
            title='取消'
        >
        </BaseTitleBt>;

        return (
            <View style={[styles.wrapper, {paddingRight: this.state.paddingRight}]}>
                <TextInput
                    ref="searchInput"
                    value={value}
                    onChangeText={this.onChangeText}
                    style={styles.input}
                    editable={!disabled}
                    onSubmitEditing={this.onSubmit}
                    clearButtonMode="always"
                    underlineColorAndroid="transparent"
                    selectionColor={Colors.appUnifiedBackColor}
                    //blurOnSubmit={true}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    {...restProps}
                />
                <Image source={require('./Img/search.png')} style={styles.search}
                       resizeMode="stretch"
                />
                { this.state.isShowCancelButton ?
                    (
                        <View style={[styles.cancelTextContainer,/*{opacity: this.state.cancleBtopacity}*/]}>
                            {cancleBt}
                        </View>
                    ) : null
                }
            </View>
        );
    }
}
BaseSearchBar.defaultProps = assign(defaultProps, {styles});
