/**
 * Created by Ebates on 17/3/9.
 * MerchantPageGridViewContainer 在商家页用的 网格控件的 数据源
 */
import React, {Component} from 'react';
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


 class MerchantPageGridViewContainer extends React.Component {

    render() {
        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {
                                  dispatch(BizApi.MerchantPageApi.FeaturedCategoryListApi())
                              }
                          }}
                          containerStyle={{
                              paddingLeft: 10,
                              paddingRight: 10, paddingTop: 10, paddingBottom: 10,
                              backgroundColor: Colors.white
                          }}
                          renderItem={(model/*此处的model是 {id:'',cnName:'',image:''} 结构*/) => {
                              return (
                                  <BaseBt
                                      key={model.cnName}
                                      style={ {
                                          flex: 0,
                                          marginTop: 5, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0,
                                          paddingBottom: 0,
                                          width: (GlobalStyles.window.width - 20 ) / 4,
                                          height: (200 - 30 ) / 2,
                                          //backgroundColor: Colors.getRandomColor()
                                      }}
                                      activeOpacity={0.6}
                                      disabled={false}
                                      onPress={ () => {
                                          //callback(rowData);

                                      } }
                                  >
                                      <Image source={model.image}
                                             style={{width: 55, height: 55, alignSelf: 'center', marginTop: 0,}}/>
                                      <Text style={{
                                          marginLeft: 0,
                                          marginTop: 7,
                                          fontSize: 13,
                                          color: '#404040',
                                          alignSelf: 'center',
                                          //backgroundColor: Colors.getRandomColor()
                                      }} numberOfLines={1} textAlign="center"
                                      >{model.cnName}</Text>
                                  </ BaseBt >
                              );
                          }}
                          renderLoadingStateView={
                              () => {
                                  return (
                                      <View style={{
                                          flex: 1, alignSelf: 'center', height: 180,
                                          justifyContent: 'center', alignItems: 'center',
                                          //backgroundColor:Colors.getRandomColor()
                                      }}>
                                          <Spinner style={{
                                              //backgroundColor: Colors.getRandomColor()
                                          }} isVisible={true} size={25}
                                                   color={Colors.backPopBtColor}
                                                   type='FadingCircleAlt'//'FadingCircleAlt'//'FadingCircle'//'Circle'//CircleFlip
                                              // 圆圈反转//Bounce 圆圈大小缩放
                                              //'rgba(136, 136, 136, 1)'
                                          />
                                      </View>
                                  );
                              }
                          }
                          renderFailStateView={
                              () => {
                                return BizViews.netWorkAbnormalView({flex:1,height: 180},{},{},{},()=>{
                                    this.BaseGridViewRef.fetchData();
                                });
                              }
                          }
            />
        );
    }
}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {MerchantPageGridViewReducer}=state;
    return {baseReducer: MerchantPageGridViewReducer};

}
export default connect(mapStateToProps)(MerchantPageGridViewContainer);