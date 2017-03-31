/**
 带 title   的 按钮
 */

import React, {Component, PropTypes} from 'react';
import {
    Text, StyleSheet, View, Platform
} from 'react-native';
import Colors from '../../Utils/Colors';
import BaseBt from './BaseBt'


export default class BaseTitleBt extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        backgroundColor: PropTypes.string,
        title: PropTypes.string,
        textStyle: Text.propTypes.style,
        selectTextStyle: Text.propTypes.style,//按钮 选中状态下的 文字样式, 不是 按住不放,而是用于 多选 的情况下, 此按钮 可处于 选中和未选中状态
        isSelect:false,
        btStyle: View.propTypes.style,
        selectBtStyle: View.propTypes.style,//按钮 选中状态下的 按钮样式

        // selectColor: PropTypes.string //按钮按下的颜色
        activeOpacity: PropTypes.number,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        backgroundColor: Colors.white,
        activeOpacity: 0.5,
        disabled: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            isSelect: props.isSelect
        }
    }


    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSelect!=this.state.isSelect){
            this.setState({
                isSelect:nextProps.isSelect
            })
        }
    }

    /**
     * 外部 可根据 此控件的 state 判断 是否需要 绘制 children
     * @returns {*}
     */
    renderChildren() {
        if (this.props.renderChildren) {
            // return React.cloneElement(this.props.renderChildren(state));
            return this.props.renderChildren(this.state);
        }
    }

    render() {
        Log.log('BaseTitleBt render()')

        return (
            <BaseBt
                style={ [{backgroundColor: this.props.backgroundColor}, this.state.isSelect ? (this.props.selectBtStyle ? this.props.selectBtStyle : this.props.btStyle) : this.props.btStyle]}
                //underlayColor={/*Colors.blackTranslucent*/ this.props.selectColor}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={
                    () => {
                        this.setState({
                            isSelect: !this.state.isSelect
                        })
                        return this.props.onPress()
                    }
                }
            >
                <Text
                    style={ this.state.isSelect ? (this.props.selectTextStyle ? this.props.selectTextStyle : this.props.textStyle) : this.props.textStyle}
                    numberOfLines={1}>
                    {this.props.title}
                </Text>
                {/*{this.props.children}*/}
                {this.props.renderChildren ? this.renderChildren() : this.props.children}

            </BaseBt>
        );
    }

};


// FontAwesomeIconBts.propTypes = propTypes;
// FontAwesomeIconBts.defaultProps = defaultProps;