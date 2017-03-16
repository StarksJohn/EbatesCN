/**
 * Created by Ebates on 17/3/16.
 * 虚线 http://blog.csdn.net/honjane/article/details/52947725
 */
import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
const screenWidth = Dimensions.get('window').width;

export default class BaseDashLine extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        customContainerStyle: Text.propTypes.style,
        customDashItemStyle: Text.propTypes.style,
    };

    static defaultProps = {
        customContainerStyle: {},
        customDashItemStyle: {},
    };

    render() {
        let len = Math.ceil(this.props.customContainerStyle.width / (this.props.customDashItemStyle.width + this.props.customDashItemStyle.marginRight));
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        return <View style={[styles.containerStyle, this.props.customContainerStyle]}>
            {
                arr.map((item, index) => {
                    return <Text key={'dash' + index}
                                 style={[styles.dashItem, this.props.customDashItemStyle]}>
                    </Text>
                })
            }
        </View>
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        //flex: 1,
        backgroundColor: '#ddd',
    }
})