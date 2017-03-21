/**
 * BaseBt
 */

import React from 'react';
import {TouchableHighlight, TouchableNativeFeedback,TouchableOpacity, Platform} from 'react-native';
// import Colors from '../utils/Colors';

function BaseBt(props) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={props.style}
            //underlayColor={props.underlayColor}//没用,activeOpacity 有用
            activeOpacity={props.activeOpacity}
            disabled={props.disabled}//
            {...props}
        >
            {props.children}
        </TouchableOpacity>
    )
}
//
// function TouchableIOS(props) {
//     return (
//         <TouchableHighlight
//             accessibilityTraits="button"
//             underlayColor={props.underlayColor}//按下时背景色,不设置就默认按下 时 黑色
//             {...props}
//         />
//         //{props.children}
//
//         //</TouchableHighlight>
//
//     )
// }

// function TouchableAD(props) {
//     return <TouchableNativeFeedback
//         delayPressIn={0}
//         background={TouchableNativeFeedback.SelectableBackground()}
//         {...props}
//     />
//
//     //props.children
//
//
//     //</TouchableNativeFeedback>
//
// }

const CommonTouchableComp = Platform.OS === 'android' ? BaseBt : BaseBt;

export default CommonTouchableComp;