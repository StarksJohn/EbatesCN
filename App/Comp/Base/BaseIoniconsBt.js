/**
 * Created by Ebates on 17/3/13.
 * BaseIoniconsBt
 */

import React, {
    Component,
    PropTypes
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Px2dp from '../../Utils/Px2dp'

export default  function BaseIoniconsBt(props) {
    const {btStyle,iconStyle, onPress,  } = props

    if (Platform.OS === 'android') {
        return (
            <TouchableNativeFeedback onPress={onPress} style={[styles.defaultBtStyle,btStyle]}>
                <Ionicons name={iconStyle.name} size={Px2dp(iconStyle.iconSize)} color={iconStyle.iconColor}/>
            </TouchableNativeFeedback>
        )
    } else {
        return (
            <TouchableOpacity onPress={onPress} style={[styles.defaultBtStyle,btStyle]}
                              activeOpacity={0.5}
            >
                <Ionicons name={iconStyle.name} size={Px2dp(iconStyle.iconSize)} color={iconStyle.iconColor}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    defaultBtStyle: {
        // width: 35,
        // height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 35,
    },

});
