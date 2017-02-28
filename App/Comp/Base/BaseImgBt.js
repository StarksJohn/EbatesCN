/**
 * BaseImgBt
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
        uri: PropTypes.string,//网络图片的地址
        localPath: PropTypes.object,//本地图片的地址, 外部用 localPath={require('../Img/search.png')} 格式传

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
        const {btStyle, activeOpacity, disabled, onPress, uri, imgStyle, localPath} = this.props;
        let content = null;
        if (uri) {
            content = <ImageProgress
                key={uri}
                source={{uri: uri}}
                //indicator={Progress.Bar} 不选此属性,默认用 系统菊花,因 此第三方库估计没适配最新的rn 版本
                style={
                    imgStyle
                    /*{width: 110, height: 35, backgroundColor:Colors.getRandomColor()}*/
                }
                onLoaded={() => {
                    //showToast('ImageProgress onLoaded')
                }}
            />
        } else if (localPath) {
            content = <Image source={localPath} style={imgStyle}/>

        }

        return (
            <BaseBt
                style={
                    /*{
                     backgroundColor: this.props.backgroundColor, flex: 1, borderRadius: 6,
                     alignItems: 'center',
                     justifyContent: 'center',
                     }*/
                    [btStyle]}
                activeOpacity={activeOpacity}
                disabled={disabled}
                onPress={ onPress }
            >
                {content}

            </BaseBt>
        );
    }

};


// FontAwesomeIconBts.propTypes = propTypes;
// FontAwesomeIconBts.defaultProps = defaultProps;