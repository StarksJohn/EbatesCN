/**
 * BizCountDownView 业务逻辑需要的 显示的 倒计时 控件, 显示格式是 hh:mm:ss
 * 代码是 一个第三方库的,第三方库很垃圾,找不到名字了,再加上自己添加的代码
 */

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import *as DateUtils from '../../Utils/DateUtils'
import SMSTimer from '../../Utils/SMSTimer'
import Colors from '../../Utils/Colors'


export default class BizCountDownView extends Component {
    // static displayName = 'Simple countDown';
    static propTypes = {
        // date: PropTypes.string,
        startDate: PropTypes.string,//'2017-03-22T00:00:00+00:00' UTC格式
        endDate: PropTypes.string,//'2017-03-22T00:00:00+00:00' UTC格式
        // days: PropTypes.objectOf(PropTypes.string),
        // hours: PropTypes.string,
        // mins: PropTypes.string,
        // segs: PropTypes.string,
        onEnd: PropTypes.func, //倒计时完毕,外部回调
        hoursStyle: View.propTypes.style,//小时 字体的style
        minsStyle: View.propTypes.style,//分钟 字体的style
        secsStyle: View.propTypes.style,//秒数 字体的style
        firstColonStyle: View.propTypes.style,//从左向右 第一个冒号 字体的style
        secondColonStyle: View.propTypes.style,//从左向右 第2个冒号 字体的style

    };
    static defaultProps = {
        // date: new Date(),
        startDate: '',//'2017-03-22T00:00:00+00:00' UTC格式
        endDate: '',//'2017-03-22T00:00:00+00:00' UTC格式
        // days: {
        //     plural: 'Days',//复数
        //     singular: 'Day',//单数
        // },
        // hours: ':',
        // mins: ':',
        // segs: ':',
        onEnd: () => {
        },

    };

    constructor(props) {
        super(props);

        let t = DateUtils.CountDownUtil(this.props.startDate, this.props.endDate);
        this.state=t;

        this.timer = new SMSTimer({
            timerNums: t.RemainingTime,
            callBack: (time) => {
                // Log.log('time===' + time);

                if (time == -1) {
                    this.setState({
                        d: 0,//天
                        h: 0,//时
                        m: 0,//分
                        s: 0,//秒
                        RemainingTime: 0//剩余几 毫秒
                    })
                    this.props.onEnd();
                    // Log.log('还剩 ' + nD + '天 ' + nH + '小时 ' + nM + '分 ' + nS + '秒');
                }else{
                    time *= 1000;//转成毫秒
                    let newTime = DateUtils.millisecondsToTime(time)
                    this.setState(newTime)
                    // Log.log('还剩 ' + newTime.d + '天 ' + newTime.h + '小时 ' + newTime.m + '分 ' + newTime.s + '秒');
                }
            }
        });
        this.timer.start();
    }

    // state = {
    //     days: 0,
    //     hours: 0,
    //     min: 0,
    //     sec: 0,
    // };

    componentDidMount() {

        //每隔一秒,
        // this.interval = setInterval(() => {
        //     const date = this.getDateData(this.props.date);
        //     if (date) {
        //         this.setState(date);
        //     } else {
        //         this.stop();
        //         this.props.onEnd();
        //     }
        // }, 1000);
    }

    componentWillMount() {
        // const date = this.getDateData(this.props.date);
        // if (date) {
        //     this.setState(date);
        // }

    }

    componentWillUnmount() {
        // this.stop();
        this.timer.deallocInterval();

    }

    // getDateData(endDate) {
    //     let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;
    //
    //     if (diff <= 0) {
    //         return false;
    //     }
    //
    //     const timeLeft = {
    //         years: 0,
    //         days: 0,
    //         hours: 0,
    //         min: 0,
    //         sec: 0,
    //         millisec: 0,
    //     };
    //
    //     if (diff >= (365.25 * 86400)) {
    //         timeLeft.years = Math.floor(diff / (365.25 * 86400));
    //         diff -= timeLeft.years * 365.25 * 86400;
    //     }
    //     if (diff >= 86400) {
    //         timeLeft.days = Math.floor(diff / 86400);
    //         diff -= timeLeft.days * 86400;
    //     }
    //     if (diff >= 3600) {
    //         timeLeft.hours = Math.floor(diff / 3600);
    //         diff -= timeLeft.hours * 3600;
    //     }
    //     if (diff >= 60) {
    //         timeLeft.min = Math.floor(diff / 60);
    //         diff -= timeLeft.min * 60;
    //     }
    //     timeLeft.sec = diff;
    //     return timeLeft;
    // }

    render() {
        // const countDown = this.state;
        // let days;
        // if (countDown.days === 1) {
        //     days = this.props.days.singular;
        // } else {
        //     days = this.props.days.plural;
        // }
        // Log.log('BizCountDownView render 正在画 倒计时控件, this.state='+Log.writeObjToJson(this.state))
        return (
            <View style={{
                flexDirection: 'row',
                //backgroundColor: Colors.getRandomColor()
            }}>
                <Text style={this.props.hoursStyle}>{ DateUtils.leadingZeros(this.state.h)}</Text>
                <Text style={ this.props.firstColonStyle}>:</Text>
                <Text style={this.props.minsStyle}>{DateUtils.leadingZeros(this.state.m)}</Text>
                <Text style={this.props.secondColonStyle}>:</Text>
                <Text style={this.props.secsStyle}>{DateUtils.leadingZeros(this.state.s)}</Text>
            </View>
        );
        // (<Text style={styles.cardItemTimeRemainTxt}>
        //         {
        //             ((countDown.days > 0) ? this.leadingZeros(countDown.days) + days : '')
        //             + this.leadingZeros(countDown.hours)
        //             + ':' + this.leadingZeros(countDown.min)
        //             + ':' + this.leadingZeros(countDown.sec)
        //         }
        //     </Text>
        // );
    }

    // stop() {
    //     // clearInterval(this.interval);
    // }
    //

};


// const styles = StyleSheet.create({
//     cardItemTimeRemainTxt: {
//         fontSize: 10,
//         color: '#ee394b'
//     },
//
// });