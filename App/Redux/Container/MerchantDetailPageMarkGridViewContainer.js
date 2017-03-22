/**
 * Created by Ebates on 17/3/9.
 * MerchantPageGridViewContainer 在 商家详情 页用的 标签 网格控件的 数据源
 */
import React, {Component, PropTypes} from 'react';
import {
    View, Text, Image
} from 'react-native';
import {connect} from 'react-redux';
import BaseGridView from '../../Comp/Base/BaseGridView'
import *as BizApi from '../../NetWork/API/BizApi'
import Colors from '../../Utils/Colors'
import GlobalStyles from '../../Global/GlobalStyles'
import *as Math from '../../Utils/Math'


class MerchantDetailPageMarkGridViewContainer extends React.Component {
    static propTypes = {
        items: PropTypes.array,//数据源
    };

    static defaultProps = {
        items: [],
    };

    getTagImg(title) {
        switch (title) {
            case '接受国卡': {
                return require('../../Img/merchant_icon_paymenttype.png')
            }
                break;
            case '接受PayPal':{
                return require('../../Img/merchant_icon_paypal.png')
            }
            break;
            case '直邮中国':{
                return require('../../Img/merchant_icon_shipping.png')
            }
            break
            case '联名卡推荐商家':{
                return require('../../Img/merchant_icon_ms.png')
            }
                break
            case '接受支付宝':{
                return require('../../Img/merchant_icon_alipay.png')
            }
            break
            case '支持中文':{
                return require('../../Img/merchant_icon_chinese.png')
            }
                break
            case '最高返利保障':{
                return require('../../Img/merchant_icon_guaranteed.png')
            }
                break
        }
    }

    render() {
        let self = this;

        return (
            <BaseGridView {...this.props}
                          ref={(r) => {
                              this.BaseGridViewRef = r;
                          }}
                          fetchApi={() => {
                              return (dispatch) => {//this.props.tagsDataArr
                                  dispatch(BizApi.MerchantDetailPageApi.fetchTagsData(self.props.items))
                              }
                          }}
                          containerStyle={{
                              marginTop: 15,
                              paddingLeft: 5,
                              alignSelf: 'flex-start',
                              paddingRight: 5,
                              paddingTop: 5,
                              paddingBottom: 5, //height: 20,
                              width:GlobalStyles.window.width,
                              backgroundColor: 'rgba(250, 250, 250, 1)'//'rgba(250, 250, 250, 1)'
                          }}
                          renderItem={(model/*此处的model是 {name:'接受国卡'} 结构*/) => {
                              return (
                                  <View style={{
                                      flexDirection: 'row', marginLeft: 10, marginRight: 15, marginTop: 5,
                                      marginBottom: 5,height: 15, //width: Math.randomNums(60, 100), ,
                                      alignItems: 'center',
                                      //backgroundColor: Colors.getRandomColor(),
                                  }}>
                                      <Image source={ this.getTagImg(model.name) } style={{
                                          width: 15, height: 15,
                                      }}>
                                      </Image>
                                      <Text style={{
                                          fontSize: 11, color: 'rgba(136,' +
                                          ' 136,' +
                                          ' 136, 1)', marginLeft: 5,
                                          //backgroundColor: Colors.getRandomColor()
                                      }} numberOfLines={1}
                                      >{model.name}</Text>
                                  </View>
                              );
                          }}
                          renderLoadingStateView={
                              () => {
                                  return (
                                      null
                                  );
                              }
                          }
                          renderFailStateView={
                              () => {
                                  return null;
                              }
                          }
            />
        );
    }
}

function mapStateToProps(state) {
    //推荐此种  解构赋值的写法
    const {MerchantDetailPageMarkGridViewReducer}=state;
    return {baseReducer: MerchantDetailPageMarkGridViewReducer};

}
export default connect(mapStateToProps)(MerchantDetailPageMarkGridViewContainer);