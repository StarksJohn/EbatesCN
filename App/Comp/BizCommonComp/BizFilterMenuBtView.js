/**
 * Created by Ebates on 17/2/27.
 * BizFilterMenuBtView 全部商家页 的 筛选控件  的 menu 里的 按钮 控件
 */
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, TextInput, Platform, Image, Animated} from 'react-native';
import {connect} from 'react-redux'
import Colors from '../../Utils/Colors'
import BaseBt from '../Base/BaseBt'
import *as BizViews from './BizViews'
import GlobalStyles from '../../Global/GlobalStyles'
import EventListener from '../../Utils/EventListener/EventListener'


export default class BizFilterMenuBtView extends Component {
    static propTypes = {
        onItemPress: PropTypes.func,
        model: PropTypes.object,
        changeTitleEventName:PropTypes.string,//外部可 发任何 API 需要的消息,让 绑定了消息 的 此控件 监听 此消息,改变 此控件 的title,如 全部商家页的筛选控件的 母婴 列表

    };
    static defaultProps = {
        onItemPress: (index) => {
        },
    };

    constructor(props) {
        super(props);
        this.angleToValue = 0;//控制箭头方向,0和1每次点击后切换,0是初始方向

        this.state = {
            // 排序三角的角度
            angleRotation: new Animated.Value(0),
            title:props.model.title
        }
    }

    componentDidMount() {

        const {changeTitleEventName}=this.props

        if (changeTitleEventName){//改变title事件
            this.changeTitleEventListener = new EventListener({
                eventName: changeTitleEventName, eventCallback: (title)=> {
                    // Log.log('BaseNavigationBar componentDidMount title='+title)
                    this.setState({
                        title:title
                    })
                }
            });
        }

    }

    componentWillUnmount() {

        if (this.changeTitleEventListener) {
            this.changeTitleEventListener.removeEventListener();
        }

    }

    onItemPress(index) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index);
        }

        this.chengeArrowDir(-1);
    }

    /**
     *
     * 改变箭头方向
     * i: 点击当前控件, 传-1, 让自己控件的箭头方向和自己上次的方向 相反; 在 BizFilterMenuView 里 被 主动调此函数时, 表示当前控件不是 本次被点击 的控件, 当前控件的箭头需要重置,故传0
     */
    chengeArrowDir(i) {
        if (i!=-1){
            this.angleToValue = i;
        }else{
            this.angleToValue = this.angleToValue == 0 ? 1 : 0;
        }

        Animated.sequence([
            // 箭头角度
            Animated.parallel([
                Animated.timing(this.state.angleRotation, {
                    toValue: this.angleToValue,
                    duration: 500,
                })
            ]),
        ]).start();
    }

    render() {
        const {model}=this.props;
        return (
            <BaseBt
                key={model.title}
                style={ {
                    flex: 1, //flexDirection: 'row',
                    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0,
                    paddingBottom: 0, justifyContent: 'center',
                    alignItems: 'center',
                    //width: (GlobalStyles.window.width - 20 ) / 4,
                    height: GlobalStyles.AllMerchantPageMenuBtH,
                    //backgroundColor: Colors.getRandomColor()
                }}
                activeOpacity={0.6}
                disabled={false}
                onPress={ () => {
                    this.onItemPress(model.id);
                } }
            >
                <View style={{
                    flexDirection: 'row',alignItems: 'center',
                    //backgroundColor: Colors.getRandomColor()
                }}>
                    <Text style={{
                        marginRight: 5,
                        marginTop: 0,
                        fontSize: 13,
                        color: Colors.BizCommonBlack,
                        //alignSelf: 'center',
                        //backgroundColor: Colors.getRandomColor()
                    }} numberOfLines={1} textAlign="center"
                    >{this.state.title}</Text>
                    {/*三角形*/}
                    <Animated.Image
                        style={{
                            width: 6,
                            height: 3,
                            transform: [{
                                rotate: this.state.angleRotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg']
                                })
                            }]
                        }}
                        source={require('../../Img/common_filter_arrow.png')}
                    />
                </View>

            </ BaseBt >
        );
    }
}