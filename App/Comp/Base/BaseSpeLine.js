/**
 * Created by Ebates on 16/12/19.
 * 
 * 分割线
 */
import React from 'react';
import { View} from 'react-native';
import Colors from '../../Utils/Colors'

export function baseSpeLine(props) {
    return (
        <View
            style={[{height:0.5,backgroundColor: Colors.borderColor},props]}
        >
        </View>
    );
}

