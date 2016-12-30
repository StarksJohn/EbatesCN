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
// import Icon from 'react-native-vector-icons/Ionicons';

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
    static propTypes = {
        onPress: PropTypes.func,
        iconColor: PropTypes.string,
        iconSize: PropTypes.number,
        normalName: PropTypes.string,
        selectName: PropTypes.string,
        // tag:PropTypes.string,
        initSelected: PropTypes.bool,
        activeOpacity: PropTypes.number,
        // btSelectColor: PropTypes.string //按钮按下的颜色
    };

    static defaultProps = {
        iconColor: 'white',
        iconSize: 20,
        activeOpacity: 0.5,
        initSelected: false
    };

    constructor(props) {
        super(props);
        this.isSelected=props.initSelected;
        this.state = {
            name: this.isSelected ? this.props.selectName : this.props.normalName,
        }

    }

    componentDidMount() {

    }

    onPress() {
        const {onPress, normalName, selectName, dispatch, _tag} = this.props;

        // dispatch(changeStates(_tag,name===normalName?selectName:normalName));
        // Log.log('this.isSelected===' + this.isSelected);
        this.isSelected = this.isSelected ? false : true;
        // Log.log('isSelect===' + this.isSelected);

        this.setState({
            // name: this.state.name === normalName ? selectName : normalName,
            name: this.isSelected ? this.props.selectName : this.props.normalName,
        });

        onPress(this.isSelected);

    }

    componentWillReceiveProps(nextProps) {

        // if (this.props.isSelected !== nextProps.isSelected) {
        //     this.setState({
        //         name: nextProps.isSelected ? this.props.selectName : this.props.normalName
        //     })
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {

        // if (this.props.isSelected !== nextProps.isSelected) {
        //     return true;
        // }
        // return false;
        return true;
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
        const {iconSize, iconColor, btStyle} = this.props;
        return (

            <BaseBt
                onPress={ ()=> {
                    this.onPress()
                } }
                style={   [{justifyContent: 'center', alignItems: 'center'}, btStyle] }
                activeOpacity={this.props.activeOpacity}

            >
                <FontAwesomeIcon name={this.state.name} size={iconSize} color={iconColor}/>

            </BaseBt>


        );
    }

};