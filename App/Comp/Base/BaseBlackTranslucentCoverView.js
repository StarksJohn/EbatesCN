/**
 * Created by Ebates on 16/11/7.
 *  黑色半透明的蒙层
 */

import React, {Component, PropTypes} from "react";
import {
    StyleSheet,
    View,
    Image,
    Modal, Text,
    Platform,
    TouchableHighlight
} from "react-native";
import {connect} from 'react-redux';
import Colors from '../../Utils/Colors';
import BaseBt from './BaseBt'

class BaseBlackTranslucentCoverView extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        cancel: PropTypes.func,
        couldTapBlackBackCancel:PropTypes.bool //能否点击 黑色半透明背景取消蒙层
    };
    static defaultProps = {
        visible: false,
        cancel: ()=> {
        },
        couldTapBlackBackCancel:false,
    };

    constructor(props) {
        super(props);

    }

    render() {
        let view = this.props.visible ?
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.cancel();
                }}
            >
                <BaseBt
                    style={[{
                        flex: 1,
                        justifyContent: 'center', alignItems:'center' ,backgroundColor: Colors.translucentColor('0', '0', '0', '0.4')
                    }]}
                    onPress={ this.props.cancel }
                    disabled={!this.props.couldTapBlackBackCancel}
                >
                    {this.props.children}
                </BaseBt>
            </Modal>
            : null;
        return view;
    }
}

export default connect()(BaseBlackTranslucentCoverView);