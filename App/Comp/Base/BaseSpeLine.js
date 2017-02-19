/**
 * Created by Ebates on 16/12/19.
 * 
 * 分割线
 */
import React from 'react';
import { View} from 'react-native';
import Colors from '../../Utils/Colors'
import GlobalStyles from '../../Global/GlobalStyles'

export function baseSpeLine(props) {
    return (
        <View
            style={[{height:0.5,backgroundColor: Colors.borderColor, marginLeft: 15, width:GlobalStyles.window.width - 30},props]}
        >
        </View>
    );
}

