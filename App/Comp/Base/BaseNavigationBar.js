/**
 * BaseNavigationBar
 * @flow
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Navigator,
    Platform,
    TouchableOpacity,
    Image,
    StatusBar,
    Text,
    View
} from 'react-native'
import GlobalStyles from '../../Global/GlobalStyles'
import Colors from '../../Utils/Colors';
import FontAwesomeIconBts from './FontAwesomeIconBts';
// import {showToast} from '../../comp/CommonComp';
// import Log from '../../utils/Log'
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import BaseTitleBt from './BaseTitleBt'

const NAV_BAR_HEIGHT_IOS = GlobalStyles.nav_bar_height_ios;
const NAV_BAR_HEIGHT_ANDROID = GlobalStyles.nav_bar_height_android;
// const STATUS_BAR_HEIGHT = GlobalStyles.STATUS_BAR_HEIGHT;
const ButtonShape = {
    title: PropTypes.string.isRequired,
    style: PropTypes.any,
    handler: PropTypes.func,
};
const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default',]),
    networkActivityIndicatorVisible: PropTypes.bool,
    showHideTransition: PropTypes.oneOf(['fade', 'slide']),
    hidden: PropTypes.bool,
    translucent: PropTypes.bool,
    backgroundColor: PropTypes.string,
    animated: PropTypes.bool
};

/*
 通用默认的左上角点击
 */
export function  baseOnBackPress(navigator) {
    navigator.pop();//app 页面回退
    return true;//作用: 避免安卓点Home键, 完全退出
}


/**
 * 导航栏
 */
export default class BaseNavigationBar extends Component {
    static propTypes = {
        style: View.propTypes.style,
        navigator: PropTypes.object,
        leftButtonTitle: PropTypes.string,
        popEnabled: PropTypes.bool,
        onLeftButtonClick: PropTypes.func,
        title: PropTypes.string,
        titleTextView: PropTypes.element,
        hide: PropTypes.bool,
        statusBarCustomStyle: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        leftButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        titleTextNumberOfLines: PropTypes.number,//titleView里的 Text的 行数,避免 文字过多导致 显示不下

    };
    static defaultProps = {
        statusBarCustomStyle: {
            barStyle: 'default',
            hidden: false,
            translucent: false,
            animated: false,
        },
        title: '带我去打网球打网球订位打网球打网球带我去的完全打网球打网球打网球打网球完全打网球打网球带我去的期望打网球打网球',
        titleTextNumberOfLines: 1,
        // onLeftButtonClick:this.onLeftButtonClick()
    }

    constructor(props) {
        super(props);
        this.state = {
            // title: '',
            popEnabled: true,
            hide: false
        };
    }

    leftView() {
        var leftView = this.props.leftButtonTitle ?
            <Text style={styles.title}>{this.props.leftButtonTitle}</Text> : null;
        return (
            <TouchableOpacity
                onPress={()=>this.onLeftButtonClick()}>
                <View style={{width: 50, alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                    {this.props.leftView ? this.props.leftView : leftView}
                </View>
            </TouchableOpacity>
        )
    }

    onLeftButtonClick() {
        if (this.props.navigator && this.props.popEnabled) {
            this.props.navigator.pop();
        }
        if (this.props.onLeftButtonClick) {
            this.props.onLeftButtonClick();
        }
    }

    getButtonElement(data = {}, style) {
        return (
                (!!data.props) ? data : (
                    <View style={styles.navBarButton}>
                    <NavBarButton
                        title={data.title}
                        style={[data.style, style,]}
                        tintColor={data.tintColor}
                        handler={data.handler}/>
                    </View>
                )

            // <View style={styles.navBarButton}>
            //     {(!!data.props) ? data : (
            //         <NavBarButton
            //             title={data.title}
            //             style={[data.style, style,]}
            //             tintColor={data.tintColor}
            //             handler={data.handler}/>
            //     )}
            // </View>
        );
    }

    render() {

        let statusBar = !this.props.statusBarCustomStyle.hidden ?
            <View style={ /*styles.statusBar*/ GlobalStyles.statusBarStyle}>
                <StatusBar {...this.props.statusBarCustomStyle}
                           style={ /*styles.statusBar*/ GlobalStyles.statusBarStyle}/>
            </View> : null;

        let titleTextView = this.props.titleTextView ? this.props.titleTextView :
            <Text style={[styles.defaultTitleStyle, this.props.titleTextStyle]}
                  numberOfLines={this.props.titleTextNumberOfLines}
            >
                {this.props.title}
            </Text>;

        //画nav
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={styles.navBarTitleContainer}>
                    {titleTextView}
                </View>
                {this.getButtonElement(this.props.rightButton, {marginRight: 8,})}
            </View>;
        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }
}


/**
 * 导航栏按钮
 */
export class NavBarButton extends Component {
    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        tintColor: PropTypes.string,
        title: PropTypes.string,
        handler: PropTypes.func,
    };

    static defaultProps = {
        style: {},
        title: '',
        tintColor: '#0076FF',
        onPress: () => ({}),
    };

    constructor(props) {
        super(props);
    }

    /**
     * 返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getBackButton(callBack) {
        return<FontAwesomeIconBts
            btStyle={{
                width: 30,
                height: 30,
                /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginLeft: 7 ,
                //backgroundColor:Colors.green
            }}
            btSelectColor={Colors.blackTranslucent}
            normalName={'angle-left'}
            selectName={'angle-left'}
            iconSize={25}
            iconColor={Colors.black}
            onPress={callBack}
        />
    }

    //新用户注册|已有账号去登录
    static newUserRegister(callBack,props) {
        return(
            <BaseTitleBt
                btStyle={{
                     height: 40, alignItems: 'center', marginRight: 15,justifyContent: 'center',
                    backgroundColor:Colors.white
                }}
                selectColor={Colors.blackTranslucent}
                onPress={callBack}
                textStyle={{
                    fontSize: 12,
                    //fontFamily: 'Gill Sans',
                    color: 'rgba(54, 166, 66, 1)',
                }}
                title={props.title}
            >
            </BaseTitleBt>

        );
    }

    /**
     * 首页左上角按钮
     * @param callBack
     * @returns {XML}
     */
    static getBarsButton(callBack) {
        return<FontAwesomeIconBts
            btStyle={{
                width: 36,
                height: 36,
                /*justifyContent: 'center', alignItems: 'center', marginTop: 15,  */ marginLeft: 15 ,
                //backgroundColor:Colors.green
            }}
            btSelectColor={Colors.blackTranslucent}
            normalName={'bars'}
            selectName={'angle-left'}
            iconSize={30}
            iconColor={Colors.white}
            onPress={callBack}
        />
    }


    render() {
        const {style, tintColor, margin, title, handler} = this.props;

        return (
            <TouchableOpacity style={styles.navBarButton} onPress={handler}>
                <View style={style}>
                    <Text style={[styles.title, {color: tintColor,},]}>{title}</Text>
                </View>
                <View style={style}>
                    <Text style={[styles.title, {color: tintColor,},]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4caf50',
    },
    //导航栏的style
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',//子视图上下居中
        justifyContent: 'space-between',//定义了项目(子视图)在主轴上(此处为左右方向)的对齐方式
        // backgroundColor: 'red',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        // shadowOffset:{
        //     width: 1,
        //     height: 0.5,
        // },
        // shadowColor: '#55ACEE',
        // shadowOpacity: 0.8,
    },
    navBarTitleContainer: {//titleText 的 背景view
        // backgroundColor: Colors.red,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,//dip数值,实际像素根据屏幕计算
        top: 0,
        right: 40,
        bottom: 0,
    },
    defaultTitleStyle: {//默认title的style
        fontSize: 20,
        color: '#FFFFFF',
        // backgroundColor: Colors.blue,
        textAlign: 'center',
        // height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
    },
    navBarButton: {
        alignItems: 'center', backgroundColor: 'blue'/*,width: 30 , justifyContent:'center', */,
    },
    // statusBar: {
    //     height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    //     // backgroundColor: Colors.backGray
    // },
})
