/**
 * Created by Ebates on 2017/4/8.
 * BasePoplist.js 通用的 带箭头的弹出列表 控件
 */
import React, {PropTypes,Component} from 'react';
import {View, Image, Text, Animated,StyleSheet,TouchableOpacity} from 'react-native';
import Colors from '../../Utils/Colors'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


export default class BasePoplist extends Component {
    static propTypes = {
        dataArr: React.PropTypes.object,
        onSelectRow: React.PropTypes.func,
        containerStyle: PropTypes.any,//弹出列表的 根组件容器 组件的 样式
        backCancelbtStyle: PropTypes.any, //弹出列表 的 父组件的父组件,也就是 可点击 取消 弹出列表的 按钮 的样式
        AnimatedViewStyle: PropTypes.any, //弹出列表 的 父组件,也就是 有动画效果的 视图 的样式
        arrowStyle: PropTypes.any,
        popListStyle: PropTypes.any,
        renderRow: PropTypes.func,
    };

    static defaultProps = {
        containerStyle: {},
        backCancelbtStyle: {},
        AnimatedViewStyle: {},
        arrowStyle: {},
        popListStyle: {},
        onSelectRow: () => {

        },
        renderRow: () => {

        },
        dataArr: [],
    };

    heightValue = new Animated.Value(0);
    state = {
        isShow: false,
        _dataArr: []
    }

    componentWillReceiveProps(nextProps) {
        const {dataArr} = nextProps
        this.setState({_dataArr: dataArr})
    }

    show = () => {
        if (this.state.isShow){
            this._close();
            return;
        }

        this.setState({isShow: true}, () => {
            Animated.spring(this.heightValue, {
                toValue: 1,
                duration: 250,
            }).start()
        })
    }

    _close = () => {
        Animated.spring(this.heightValue, {
            toValue: 0,
            duration: 250,
        }).start(() => this.setState({isShow: false}))
    }

    // _onPress = () => {
    //     const {onSelectRow} = this.props
    //     Animated.spring(this.heightValue, {
    //         toValue: 0,
    //         duration: 250,
    //     }).start(() => {
    //         onSelectRow && onSelectRow(rowData)
    //         this.setState({isShow: false})
    //     })
    // }

    // _renderRow = (rowData, key) => {
    //
    //     const {name} = rowData
    //     const {dataArr} = this.state
    //     const isLastItem = key == dataArr.length - 1
    //
    //     return (
    //         <TouchableOpacity
    //             key={`${name}-${key}`}
    //             activeOpacity={0.75}
    //             style={[styles.subcategoryItem, isLastItem && {borderBottomWidth: 0}]}
    //             onPress={() => this._onPress(rowData)}
    //         >
    //             <Text style={{color: '#fff', fontSize: 13}}>{name}</Text>
    //         </TouchableOpacity>
    //     )
    // }

    render() {
        if (!this.state.isShow) return null;
        const {_dataArr} = this.state;
        const top = this.heightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-(40 * _dataArr.length+gScreen.navBarHeight), 5]
        })

        return (
            <View style={[styles.defalutContainerStyle, this.props.containerStyle]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.defaultBackCancelbtStyle, this.props.backCancelbtStyle]}
                    onPress={this._close}
                >
                    <Animated.View style={[styles.defaultAnimatedViewStyle, {top}, this.props.AnimatedViewStyle]}>
                        {/*箭头*/}
                        <FontAwesomeIcon name='sort-up' size={20} style={[styles.defaultArrowStyle,this.props.arrowStyle]} color={'rgba(43, 45, 49, 0.95)'}/>
                        {/*弹出列表*/}
                        <View style={[styles.defalutPopListStyle, this.props.popListStyle]}>
                            {_dataArr.map((model) => {
                                // let i = renderItem(model);//外部绘制每个cell里的 格子
                                return this.props.renderRow(model,this._close);
                            })
                            }
                        </View>
                    </Animated.View>

                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    defalutContainerStyle: {zIndex: 2, position: 'absolute', top: gScreen.navBarHeight, left: 0},
    defaultBackCancelbtStyle: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: gScreen.width,
        height: gScreen.height - gScreen.navBarHeight,
        justifyContent: 'flex-end',
        zIndex: 1
    },
    defaultAnimatedViewStyle: {
        //backgroundColor: getRandomColor(),
        position: 'absolute',
        right: 10,
    },
    defaultArrowStyle: {
        //arrowColor:'rgba(43, 45, 49, 0.95)',
        marginRight:8, alignSelf:'flex-end',//width: 20, height: 20
        //position: 'absolute', top: 0, right: 7, width: 10, height: 10,
         backgroundColor: Colors.transparent
    },
    defalutPopListStyle: {
        backgroundColor: 'rgba(43, 45, 49, 0.95)',
        marginTop: -12,borderRadius: 5, //marginTop: 10
    }
});