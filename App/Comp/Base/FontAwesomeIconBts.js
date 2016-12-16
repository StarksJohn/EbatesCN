/**
 * Created by Ebates on 16/10/2.
 * 显示 react-native-vector-icons和 ionicons | FontAwesome 图标 的按钮
 *  * 因 点击此按钮后每个cell上的此按钮实例都变了状态,估计 自己 redux 玩的 还不6, 故此控件先不用redux
 http://fontawesome.io/icons/ 可搜素想要的 FontAwesome 的字体
 */

import React, {PropTypes, Component} from 'react';
import {
    // TouchableOpacity,
    // StyleSheet
    TouchableOpacity
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import BaseBt from './BaseBt';
// import {changeStates,InitNormalStates} from '../../actions/ActionTypes';

// const propTypes = {
//     onPress: PropTypes.func,
//     iconColor: PropTypes.string,
//     iconSize: PropTypes.number,
//     normalName: PropTypes.string,
//     selectName: PropTypes.string,
//     // tag:PropTypes.string,
//     isSelected: PropTypes.bool,
//     btSelectColor: PropTypes.string //按钮按下的颜色
// };

// const defaultProps = {
//     iconColor: 'white',
//     iconSize: 20,
// };

export default class FontAwesomeIconBts extends Component {
    static defaultProps = {
        iconColor: 'white',
        iconSize: 20,
    };

    static propTypes = {
        onPress: PropTypes.func,
        iconColor: PropTypes.string,
        iconSize: PropTypes.number,
        normalName: PropTypes.string,
        selectName: PropTypes.string,
        // tag:PropTypes.string,
        isSelected: PropTypes.bool,
        btSelectColor: PropTypes.string //按钮按下的颜色
    };

    constructor(props) {
        super(props);
        // this.onPress = this._onPress.bind(this);
        this.state = {
            name: this.props.isSelected ? this.props.selectName : this.props.normalName,
        }

        // showToast('正在'+this.props.ApiName+' 列表的 收藏icon的 constructor 方法'+ '     this.state.name='+this.state.name);

    }

    componentDidMount() {

    }

    onPress() {
        const {onPress, normalName, selectName, dispatch, _tag} = this.props;
        onPress();

        // dispatch(changeStates(_tag,name===normalName?selectName:normalName));

        this.setState({
            name: this.state.name === normalName ? selectName : normalName,
        })
    }

    componentWillReceiveProps(nextProps) {

        // showToast('正在'+this.props.ApiName+' 列表的 收藏icon的 componentWillReceiveProps 方法'+'\n'+'this.props.isSelected=='+this.props.isSelected+'\n'+'nextProps.isSelected=='+nextProps.isSelected+'\n'+'this.state.name='+this.state.name);

        if (this.props.isSelected !== nextProps.isSelected) {
            this.setState({
                name: nextProps.isSelected ? this.props.selectName : this.props.normalName
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // showToast('正在'+this.props.ApiName+' 列表的 收藏icon的 shouldComponentUpdate() 方法'+'\n'+'this.props.isSelected=='+this.props.isSelected+'\n'+'nextProps.isSelected=='+nextProps.isSelected+'\n'+'this.state.name='+this.state.name);

        if (this.props.isSelected !== nextProps.isSelected) {
            return true;
        }
        return false;

    }

    /**
     * eg: btStyle={
                                     backgroundColor: getRandomColor(), width: 30,
                                     height: 30,
                                     marginRight: 5,
                                     justifyContent: 'center',alignItems:'center'
                                 }
     * @returns {XML}
     */
    render() {
        const {iconSize, iconColor, btStyle, btSelectColor} = this.props;
        // showToast('正在画'+this.props.ApiName+' 列表的 收藏icon  ,this.state.name='+this.state.name);

        return (

            // <Ionicons style={style}//{{backgroundColor:Colors.red, width:20}}
            //           name={this.state.name}//{'md-heart-outline'}
            //           size={size}
            //           color={color}
            //           onPress={this.onPress}
            // />

            <BaseBt
                onPress={ ()=> {
                    this.onPress()
                } }
                style={   [{justifyContent: 'center', alignItems: 'center'}, btStyle] }
                underlayColor={btSelectColor}

            >
                <FontAwesomeIcon name={this.state.name} size={iconSize} color={iconColor}/>

            </BaseBt>


        );
    }

};

// FontAwesomeIconBts.propTypes = propTypes;
// FontAwesomeIconBts.defaultProps = defaultProps;