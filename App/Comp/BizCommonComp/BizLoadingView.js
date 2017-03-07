/**
 * Created by Ebates on 16/12/15.
 * BizLoadingView
 * 页面上loading时,屏幕中间显示的 loading 动画
 */
import React, {Component} from 'react';
import {
    DeviceEventEmitter, InteractionManager, StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
} from 'react-native';
import Colors from '../../Utils/Colors'
import Spinner from 'react-native-spinkit'

const {height, width} = Dimensions.get('window');
export const ShowBizLoadingView = 'ShowBizLoadingView';//显示 BizLoadingView 的信号
export const CloseBizLoadingView = 'ShowBizLoadingView';//显示 BizLoadingView 的信号

export function showBizLoadingView(text) {

    DeviceEventEmitter.emit(ShowBizLoadingView, text);
}

export function closeBizLoadingView() {

    DeviceEventEmitter.emit(CloseBizLoadingView);
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, height: height, left: 0,//此处不得不根据具体项目改值
        right: 0,//此处不得不根据具体项目改值
        alignItems: 'center', justifyContent: 'center',
        //backgroundColor:Colors.getRandomColor()
    },
    content: {
        backgroundColor: Colors.black,
        borderRadius: 4, alignItems: 'center',
        paddingLeft: 15, paddingRight: 17,//17是为了让菊花能相对看上去 左右剧中
    },
    text: {
        fontSize: 13, lineHeight: 20, color: Colors.white, fontWeight: 'bold', marginTop: 10, marginBottom: 20,
    }
});

export default class BizLoadingView extends Component {
    static propTypes = {
        style: View.propTypes.style,
        position: React.PropTypes.oneOf([
            'top',
            'center',
            'bottom',
        ]),
        textStyle: Text.propTypes.style,
        positionValue: React.PropTypes.number,
        fadeInDuration: React.PropTypes.number,
        fadeOutDuration: React.PropTypes.number,
        opacity: React.PropTypes.number
    };
    static defaultProps = {
        position: 'center',
        textStyle: styles.text,
        positionValue: 120,
        fadeInDuration: 500,
        fadeOutDuration: 0,
        opacity: 1,
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            text: '',
            opacityValue: new Animated.Value(this.props.opacity),//黑框透明度
        }
    }

    componentDidMount() {
        this.ShowListener = DeviceEventEmitter.addListener(ShowBizLoadingView, (text) => {
            InteractionManager.runAfterInteractions(() => {
                this.show(text);
            });

        });

        this.CloseListener = DeviceEventEmitter.addListener(CloseBizLoadingView, () => {
            InteractionManager.runAfterInteractions(() => {
                this.close();
            });

        });
    }

    componentWillUnmount() {
        if (this.ShowListener) {
            this.ShowListener.remove();
        }
        if (this.CloseListener) {
            this.CloseListener.remove();
        }
        this.timer && clearTimeout(this.timer);
    }

    show(text) {
        // this.duration = duration || DURATION.LENGTH_SHORT;

        this.setState({
            isShow: true,
            text: text,
        });

        Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        ).start(() => {
            this.isShow = true;
            // if (this.SpinnerRef) {
            //     this.SpinnerRef.measure((fx, fy, width, height, px, py) => {
            //         Log.log(fx, fy, width, height, px, py);
            //     })
            // }
        });
    }

    close() {
        let delay = this.duration;

        if (!this.isShow){
            Log.log('BizLoadingView close() 不需要close')
            return;
        }
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0.0,
                    duration: this.props.fadeOutDuration,
                }
            ).start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
            });
        }, delay);
    }

    render() {
        let pos;
        switch (this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2 - 50/*黑框里的文字只有一行, 故黑框高度肯定是固定的,目测是100,故 黑框的 top上移50*/;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
        }
        let view = this.state.isShow ?
            <View ref='BizLoadingViewRef'
                  style={[styles.container, /*{ top: pos }*/]}
                //pointerEvents="none"
            >
                <Animated.View
                    style={[styles.content, {opacity: this.state.opacityValue}, this.props.style]}
                >
                    <Spinner  style={{
                        marginTop: 20,
                        //color:Colors.white,
                        //backgroundColor: Colors.getRandomColor()
                    }} isVisible={true} size={20}
                             color="#FFFFFF"
                             type='Circle'//'FadingCircleAlt'//'FadingCircle'//'Circle'//CircleFlip
                        // 圆圈反转//Bounce 圆圈大小缩放
                        //'rgba(136, 136, 136, 1)'
                    />
                    <Text style={this.props.textStyle}>{this.state.text}</Text>
                </Animated.View>
            </View> : null;
        return view;
    }
}

