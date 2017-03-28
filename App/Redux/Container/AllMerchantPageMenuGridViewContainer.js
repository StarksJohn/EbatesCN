/**
 * Created by Ebates on 17/3/9.
 * AllMerchantPageMenuGridViewContainer 的 在 全部商家页 用的 MENU 网格控件的 数据源
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


export class AllMerchantPageMenuGridViewContainer extends React.Component {
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

    onItemPress(index) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index);
        }

        this.BizFilterMenuBtViewRefArr.map((v, i) => {
            if (index != i) {//改变 非 点击 按钮的 箭头方向
                // v.chengeArrowDir(0);
            }
        });
    }

    render() {
        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {
                                  dispatch(BizApi.AllMerchantPageApi.fetchMenuData())
                              }
                          }}
                          containerStyle={[{
                              paddingLeft: 0,
                              paddingRight: 0, paddingTop: 0, paddingBottom: 0,
                              backgroundColor: Colors.white
                          },this.props.containerStyle]}
                          renderItem={(model/*此处的model类似是 {id:0,title:'母婴'}  结构*/) => {
                              return (
                                  <View style={{
                                      flex: 1, flexDirection: 'row', //alignItems:'center' ,
                                      //backgroundColor: Colors.getRandomColor()
                                  }}>
                                      <BizFilterMenuBtView
                                          ref={(r) => {
                                              this.BizFilterMenuBtViewRefArr.push(r);
                                          }}
                                          model={model}
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
    const {AllMerchantPageGridViewReducer}=state;
    return {baseReducer: AllMerchantPageGridViewReducer};

}
export default connect(mapStateToProps)(AllMerchantPageMenuGridViewContainer);