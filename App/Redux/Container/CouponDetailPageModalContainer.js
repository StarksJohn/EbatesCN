/**
 * Created by Ebates on 2017/4/7.
 * CouponDetailPageModelContainer.js
 * 优惠详情 页 点击 返利说明 后的弹出层 model  的 数据源
 */
import React, {Component,PropTypes} from 'react';
import {
    View, Text, Image,TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import BaseModal from '../../Comp/Base/BaseModal'
import *as BaseModalActions from '../Actions/BaseModalActions'
import Colors from '../../Utils/Colors';


export class CouponDetailPageModalContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        renderModalContent:PropTypes.func
    };
    static defaultProps = {
        renderModalContent:()=>{

        }
    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }
    render() {
        const {dispatch,baseReducer}=this.props;

        return <BaseModal
            {...this.props}
            //isModelContainerVisible={this.props.baseReducer.isModelContainerVisible}
            //changeStateEventName={CouponDetailPageRebateDescriptionModelChangeStateEventName}
            renderModalContent={
               this.props.renderModalContent
            }
        />
    }


}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {CouponDetailPageModalReducer}=state;
    return {baseReducer: CouponDetailPageModalReducer};

}
export default connect( mapStateToProps )(CouponDetailPageModalContainer);

