/**
 * Created by Ebates on 2017/4/9.
 * AboutEbatesCnPage.js 关于 页
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Platform, TextInput, Image} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../Utils/Colors';
import GlobalStyles from '../Global/GlobalStyles'
import *as BizViews from '../Comp/BizCommonComp/BizViews'
import  BaseNavigationBar, {NavBarButton, baseOnBackPress} from '../Comp/Base/BaseNavigationBar'
import BackAndroidEventListener from '../Utils/EventListener/BackAndroidEventListener'
import *as GlobalConst from '../Global/GlobalConst'
import BaseListComp from '../Comp/Base/BaseListComp'

export class AboutEbatesCnPage extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.backAndroidEventListener = new BackAndroidEventListener({
                ...props,
                backPress: (e) => baseOnBackPress(this.props.navigator),
                hardwareBackPressListenerName: gRouteName.AboutEbatesCnPage
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        return <View style={{backgroundColor: Colors.white}}>
            <Text style={{marginTop: 17, marginLeft: 15, fontSize: 15, color: Colors.allNavTitleColor}}>
                关于Ebates.cn
            </Text>
            <Text style={{marginTop: 6, marginLeft: 15, marginRight: 15,fontSize: 13,
                lineHeight:20, color: Colors.BizCommonBlack}}>
                中国海淘用户所熟知的美国最大返利网站—Ebates，现已进驻中国！正式推出专注于服务中国及广大华人圈用户的中文网站Ebates.cn。 全新上线的Ebates中文站可以更好地服务于中国本土用户，让更多的中国用户也能同样享受到原来只有北美消费者才可以享有的购物优惠。在Ebates.cn不仅可以轻松找到众多美国商家的热门优惠折扣信息，更可享受到更高的返利比例，以及中文客服团队的专业服务，让中国用户在海外网站购物享受更大的实惠和更贴心的服务。
            </Text>
            <Text style={{marginTop: 0, marginLeft: 15, marginRight: 15,fontSize: 13,
                lineHeight:20, color: Colors.BizCommonBlack}}>
                成立于1998年的Ebates开创了返利模式的先河。Ebates将零售企业付给渠道商的大部分销售佣金以现金形式返回给消费者，并以此吸引更多的人通过返利网站购买商品。这种模式受到精打细算的人们欢迎，尤其在经济危机时期，返利网站的扩张速度更是惊人。Ebates.cn作为Ebates旗下的中国站，将秉承用户至上，服务第一的理念，专为海淘、海购用户提供海外商家信息、海淘购物返利，海淘优惠促销信息，海淘购物攻略，在线服务咨询等服务。与此同时，Ebates.cn网站还将通过和媒体，支付，物流等相关渠道积极合作，努力为中国用户打造一站式的海淘购物体验。
            </Text>
            <Text style={{marginTop: 17, marginLeft: 15, fontSize: 15, color: Colors.allNavTitleColor}}>
                关于Ebates®
            </Text>
            <Text style={{marginTop: 5, marginLeft: 15, marginRight: 15,fontSize: 13, marginBottom: 20,lineHeight:20, color: Colors.BizCommonBlack}}>
                总部位于美国加州，成立于1998年，目前为美国及全球最大的返利购物网站。Ebates的会员迄今已经通过大约2700家电商网站取得超过2.5亿美金的累计返利金额。加盟的电商通过返利，特别促销，免运费，和平均超过15000个优惠码吸引Ebates的会员消费购物。任何消费者都可以免费加入并获得其每笔购物金额的一部分作为返利。
            </Text>
        </View>
    }


    render() {
        const {navigator} = this.props;

        let navigationBar =
            <BaseNavigationBar
                style={ [{backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#E4E4E4'}] }
                statusBarCustomStyle={GlobalStyles.statusBarDefaultProps}
                titleTextView={null}
                leftButton={NavBarButton.getBackButton(() => baseOnBackPress(navigator, this.backAndroidEventListener))}
                searchBar={null}
                hide={false}
                title='关于ebates.cn'
                titleTextStyle={[GlobalStyles.navBarTitleTextStyle, {},]}
            />;

        let version = '版本号: ' + GlobalConst.Version;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Image source={require('../Img/common_icon_logo.png')} style={{marginTop: 22, alignSelf: 'center'}}/>
                <Text style={{fontSize: 14, color: '#C0C0C0', alignSelf: 'center', marginBottom: 20, marginTop: 10}}>
                    {version}
                </Text>
                <BaseListComp
                    renderRow={
                        this.renderRow
                    }
                    customContainer={{marginTop: 0}}
                    {...this.props }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: Colors.BizCommonGrayBack,
    },
});

function mapStateToProps(state) {

    //推荐此种  解构赋值的写法
    const {AboutEbatesCnPageReducer}=state;
    return {baseReducer: AboutEbatesCnPageReducer};
}
export default connect(mapStateToProps)(AboutEbatesCnPage);

