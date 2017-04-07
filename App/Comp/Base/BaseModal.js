/**
 * Created by Ebates on 2017/4/6.
 * BaseModel.js 每个用到 此控件的 地方都得把 此控件用 container 包一层 reducer, 已区别 不同此控件的 实例 有不同的 数据源
 * https://github.com/react-native-community/react-native-modal
 */

import React, {Component, PropTypes}  from 'react';
import Modal from 'react-native-modal';
import {Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../Utils/Colors'
// import EventListener from '../../Utils/EventListener/EventListener'
import *as BaseModalActions from '../../Redux/Actions/BaseModalActions'

export default class BaseModal extends Component {
    constructor(props) {
        super(props);
    }

    // state = {
    //     isModelVisible: false,
    // };

    static propTypes = {
        // isModelVisible: PropTypes.bool,
        renderModalContent: PropTypes.func,
        // changeStateEventName: PropTypes.string,//任何地方只要注册了本控件实例的 changeStateEventName,就可 发这个 changeStateEventName 来改变此控件 某个实例的 state
        // onModalHide: PropTypes.func,
        // isModalContainerVisible:PropTypes.bool,//modal 的父节点 是否显示
    };


    static defaultProps = {

        // isModelVisible: false,
        // isModalContainerVisible: false,
        // changeStateEventName: '',
        renderModalContent: () => {
            // Log.log('BaseModal defaultProps renderModalContent')
        },
    };

    componentDidMount() {
        // this._fetchData(BaseListActions.BaseListFetchDataType.INITIALIZE);

        // const {changeStateEventName}=this.props
        //
        // if (changeStateEventName) {//改变 state 事件
        //     this.changeStateEventListener = new EventListener({
        //         eventName: changeStateEventName, eventCallback: (isModelVisible) => {
        //             Log.log('BaseModal componentDidMount isVisible=' + isModelVisible)
        //             this.setState({
        //                 isVisible: isModelVisible,
        //                 // isModalContainerVisible: true,
        //             })
        //         }
        //     });
        // }

    }

    componentWillUnmount() {

        // if (this.changeStateEventListener) {
        //     this.changeStateEventListener.removeEventListener();
        // }

    }

    componentWillReceiveProps(nextProps) {
        // if (!this.state.isModelVisible && nextProps.isModalContainerVisible) {
        //     Log.log('BaseModal componentWillReceiveProps ');
        //     this.setState({isModelVisible: true});
        // }
    }

    _renderModalContent = () => {
        return this.props.renderModalContent(
        )
    };

    render() {
        return (
            this.props.baseReducer.isModalContainerVisible ?
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                    <Modal
                        isVisible={this.props.baseReducer.isModelVisible}
                        backdropColor={'black'}
                        backdropOpacity={0.6}
                        animationIn={'zoomInDown'}
                        animationOut={'zoomOutUp'}
                        animationInTiming={500}
                        animationOutTiming={500}
                        backdropTransitionInTiming={500}
                        backdropTransitionOutTiming={500}
                        onModalHide={//此函数回调就证明 Modal 的 隐藏 动画执行完毕
                            () => {
                                //隐藏 BaseModal 的 父节点,也就是 react-native-modal 的 父节点
                                this.props.dispatch(BaseModalActions.changeModelContainerVisiableAction(this.props.baseReducer.ApiName, false));

                            }
                        }
                    >
                        {this._renderModalContent()}
                    </Modal>
                </View> : null
        );
    }
}