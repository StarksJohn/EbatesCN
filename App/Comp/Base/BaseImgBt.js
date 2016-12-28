/**
 带 Img   的 按钮
 */

import React, {Component, PropTypes} from 'react';
import {
    Text, StyleSheet, View, Image
} from 'react-native';
import Colors from '../../Utils/Colors';
import BaseBt from './BaseBt'
import ImageProgress from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

export default class BaseImgBt extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onPress: PropTypes.func,
        backgroundColor: PropTypes.string,
        title: PropTypes.string,
        textStyle: Text.propTypes.style,
        btStyle: View.propTypes.style,
        imgStyle: View.propTypes.style,
        // selectColor: PropTypes.string //按钮按下的颜色
        activeOpacity: PropTypes.number,
        disabled: PropTypes.bool,
        uri:PropTypes.string,
    };

    static defaultProps = {
        backgroundColor: Colors.appUnifiedBackColor,
        activeOpacity: 0.5,
        disabled: false
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
                 }*/ [{backgroundColor: this.props.backgroundColor}, this.props.btStyle]}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={ this.props.onPress }
            >
                <ImageProgress
                    key={this.props.uri}
                    source={{uri: this.props.uri}}
                    //indicator={Progress.Bar} 不选此属性,默认用 系统菊花,因 此第三方库估计没适配最新的rn 版本
                    style={
                        this.props.imgStyle
                        /*{width: 110, height: 35, backgroundColor:Colors.getRandomColor()}*/
                    }
                    onLoaded={() => {
                        //showToast('ImageProgress onLoaded')
                    }}
                />
            </BaseBt>
        );
    }

};


// FontAwesomeIconBts.propTypes = propTypes;
// FontAwesomeIconBts.defaultProps = defaultProps;