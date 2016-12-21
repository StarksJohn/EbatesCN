/**
 带 title   的 按钮
 */

import React, {Component, PropTypes} from 'react';
import {
    Text, StyleSheet, View
} from 'react-native';
import Colors from '../../Utils/Colors';
import BaseBt from './BaseBt'


export default class BaseTitleBt extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onPress: PropTypes.func,
        backgroundColor: PropTypes.string,
        title: PropTypes.string,
        textStyle: Text.propTypes.style,
        btStyle:View.propTypes.style,
        // selectColor: PropTypes.string //按钮按下的颜色
        activeOpacity:PropTypes.number,
        disabled:PropTypes.bool
    };

    static defaultProps = {
        backgroundColor:Colors.appUnifiedBackColor,
        activeOpacity:0.5,
        disabled:false
    };


    componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {

    }

    render() {

        return (
            <BaseBt
                style={/*{
                    backgroundColor: this.props.backgroundColor, flex: 1, borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                }*/ [{backgroundColor: this.props.backgroundColor},this.props.btStyle]}
                //underlayColor={/*Colors.blackTranslucent*/ this.props.selectColor}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={ this.props.onPress }
            >
                <Text style={/*{
                    backgroundColor: Colors.red
                    fontSize: 18,
                    fontFamily: 'Gill Sans',
                    color: Colors.white,
                }*/ this.props.textStyle}>
                    {this.props.title}
                </Text>
            </BaseBt>
        );
    }

};


// FontAwesomeIconBts.propTypes = propTypes;
// FontAwesomeIconBts.defaultProps = defaultProps;