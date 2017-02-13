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
    static propTypes = {
        customContainerStyle: View.propTypes.style,//外部可自定义BaseSearchBar 的style
        customSearchStyle: View.propTypes.style,//外部可自定义 search 图片 的style
        customInputStyle:View.propTypes.style,//外部自定义 TextInput的 style
        defaultPaddingRight: React.PropTypes.number,
        onFocusPaddingRight: React.PropTypes.number,//选中时 的 paddingRight
    };
    static defaultProps = {
        //在 PropsType.js里 defaultPaddingRight
    };

    constructor(props) {
        super(props);

        this.isOnBlurByonCancel=false;//onBlur 失去焦点的 回调是否是 因为 点击 cancel 按钮 触发的,也可能 是 如 外部的 搜索页面点击 热门搜索按钮 触发

        this.onFocus = () => {
            this.setState({isShowCancelButton: true, paddingRight: /* 40*/ this.props.onFocusPaddingRight});

            // this.beginAnimated();
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
            paddingRight: this.props.defaultPaddingRight /*new Animated.Value(15)*/, /*一开始默认 容器view的 右 补白距离*/
            // cancleBtopacity: new Animated.Value(0),
        };
    }

    componentWillUnmount() {
        Log.log('BaseSearchBar componentWillUnmount')
    }

    onCancel (isClearValue){
        if (this.props.onCancel) {
            this.props.onCancel(this.state.value);
        }
        this.isOnBlurByonCancel=true;

        this.refs.searchInput.blur();//主动失去光标焦点和 隐藏键盘
        if (isClearValue){
            this.refs.searchInput.clear();//清除 text
            this.setState({isShowCancelButton: false, paddingRight: this.props.defaultPaddingRight, value: ''});
        }

        this.setState({isShowCancelButton: false, paddingRight: this.props.defaultPaddingRight, });

        // this.closeAnimated();
    };

    /**
     *
     */
    onBlur () {
        this.setState({isShowCancelButton: false});

        if (!this.isOnBlurByonCancel){
            if (this.props.onBlur) {
                this.props.onBlur();
            }
        }
        // this.closeAnimated();

    };

    /**
     * 非键盘改变 TextInput 和  BaseSearchBar 值, 如 点击 搜索页的 热门搜索 按钮
     * @param value
     * @constructor
     */
    NonkeyboardChangeText(value){
        this.refs.searchInput.value=value;
        // this.refs.searchInput.blur();//主动失去光标焦点和 隐藏键盘


        this.onCancel(false);
        this.setState({
            value,
        });
    }

    onChangeText(value) {
        // if (!('value' in this.props))  这句会导致一开始有 value 的 BaseSearchBar 不能改变 其 value
        {
            this.setState({
                value,
                // paddingRight: this.props.defaultPaddingRight
            });
        }
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    onSubmit() {
        if (!this.state.isShowCancelButton) {
            Log.log('BaseSearchBar 不能 再 onSubmit,避免安卓的 点击 右下角键盘后, onSubmitEditing 回调2此的 BUG ');

            return;
        }

        Log.log('BaseSearchBar onSubmit');

        // e.preventDefault();
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.value);
        }

        this.refs.searchInput.blur();//主动失去光标焦点和 隐藏键盘
        this.setState({isShowCancelButton: false, paddingRight: /*15*/ this.props.defaultPaddingRight});
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    beginAnimated() {
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

    closeAnimated() {
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
        const {showCancelButton, cancelText, disabled, styles, customContainerStyle, customSearchStyle} = this.props;
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
            onPress={()=>this.onCancel(true)}
            textStyle={{
                fontSize: 16,
                //fontFamily: 'Gill Sans',
                color: Colors.black,
            }}
            title='取消'
        >
        </BaseTitleBt>;

        return (
            <View style={[styles.wrapper, {
                paddingRight: this.state.paddingRight,
                //backgroundColor: Colors.getRandomColor(),
            }, customContainerStyle]}>
                <TextInput
                    ref="searchInput"
                    value={value}
                    onChangeText={(value) => this.onChangeText(value)}
                    style={[styles.input,this.props.customInputStyle]}
                    editable={!disabled}
                    onSubmitEditing={() => this.onSubmit()}
                    clearButtonMode="always"
                    underlineColorAndroid="transparent"
                    selectionColor={Colors.appUnifiedBackColor}
                    //blurOnSubmit={true}
                    onFocus={this.onFocus}
                    onBlur={()=>this.onBlur()}
                    {...restProps}
                />
                <Image source={require('./Img/search.png')} style={[styles.search, customSearchStyle]}
                       resizeMode="stretch"
                />
                { this.state.isShowCancelButton ?
                    (
                        <View style={[styles.cancelTextContainer, /*{opacity: this.state.cancleBtopacity}*/]}>
                            {cancleBt}
                        </View>
                    ) : null
                }
            </View>
        );
    }
}
BaseSearchBar.defaultProps = assign(defaultProps, {styles});
