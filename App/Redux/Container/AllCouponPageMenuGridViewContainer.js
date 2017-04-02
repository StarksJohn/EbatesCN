/**
 * Created by Ebates on 17/3/9.
 * AllCouponPageMenuGridViewContainer  在 全部优惠 页 用的 MENU 网格控件的 数据源
 */
import React, {Component,PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import {connect} from 'react-redux';
import BaseGridView from '../../Comp/Base/BaseGridView'
import *as BizApi from '../../NetWork/API/BizApi'
import Colors from '../../Utils/Colors'
import Spinner from 'react-native-spinkit'
import BaseTitleBt from '../../Comp/Base/BaseTitleBt'
import GlobalStyles from '../../Global/GlobalStyles'
import BaseBt from '../../Comp/Base/BaseBt'
import *as BizViews from '../../Comp/BizCommonComp/BizViews'
import BizFilterMenuBtView from '../../Comp/BizCommonComp/BizFilterMenuBtView'
import EventListener from '../../Utils/EventListener/EventListener'
import *as AllCouponPageApi from '../../NetWork/API/AllCouponPageApi'

//重置 全部优惠页 筛选控件的 MENU 控件的 所有 箭头的方向 的 事件名
export const AllCouponPageMenuGridViewArrowDirResetEventName='AllCouponPageMenuGridViewArrowDirResetEventName'

export class AllCouponPageMenuGridViewContainer extends React.Component {
    static propTypes = {
        onItemPress: PropTypes.func,
    };
    static defaultProps = {
        onItemPress: (index) => {
        },
    };

    constructor(props) {
        super(props);
        this.BizFilterMenuBtViewRefArr = [];//装 BizFilterMenuBtView 控件的 ref
    }

    componentDidMount() {
        {//
            this.resetAllArrowsDirEventistener = new EventListener({
                eventName: AllCouponPageMenuGridViewArrowDirResetEventName, eventCallback: ()=> {
                    this.changeArrowDir(-1);
                }
            });
        }

    }

    componentWillUnmount() {

        if (this.resetAllArrowsDirEventistener) {
            this.resetAllArrowsDirEventistener.removeEventListener();
        }

    }

    onItemPress(index) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index);
        }

        this.changeArrowDir(index);

    }

    changeArrowDir(index) {
        this.BizFilterMenuBtViewRefArr.map((v, i) => {
            if (index != i) {//改变 非 点击 按钮的 箭头方向
                v.chengeArrowDir && v.chengeArrowDir(0);
            }
        });
    }

    render() {
        let self = this;

        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {
                                  dispatch(AllCouponPageApi.AllCouponPageApi.fetchMenuData())
                              }
                          }}
                          containerStyle={[{
                              paddingLeft: 0,
                              paddingRight: 0, paddingTop: 0, paddingBottom: 0,
                              backgroundColor: Colors.white
                          }, this.props.containerStyle]}
                          renderItem={(model/*此处的model类似是 {id:0,title:'分类'}  结构*/) => {
                              return (
                                  <View style={{
                                      flex: 1, flexDirection: 'row', //alignItems:'center' ,
                                      //backgroundColor: Colors.getRandomColor()
                                  }}>
                                      <BizFilterMenuBtView
                                          ref={(r) => {

                                              self.BizFilterMenuBtViewRefArr.length < self.props.baseReducer.dataArray.length && self.BizFilterMenuBtViewRefArr.push(r);
                                          }}
                                          model={model}
                                          //changeTitleEventName={model.changeTitleEventName}
                                          onItemPress={ (index) => {
                                              this.onItemPress(index);
                                          } }
                                      >
                                      </ BizFilterMenuBtView >
                                      {model.id != this.props.baseReducer.dataArray.length - 1 ? BizViews.renderVerticalLine({
                                              flex: 0,
                                              fontSize: 15,
                                              marginLeft: 0.5,
                                              alignSelf: 'center',
                                              lineHeight: 15
                                          }) : null}
                                  </View>
                              );
                          }}

            />
        );
    }
}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {AllCouponPageGridViewReducer}=state;
    return {baseReducer: AllCouponPageGridViewReducer};

}
export default connect(mapStateToProps)(AllCouponPageMenuGridViewContainer);