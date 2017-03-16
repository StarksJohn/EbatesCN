/**
 * Created by Ebates on 16/12/24.
 * 短信计时器
 */
import React, {PropTypes} from 'react';
import {} from 'react-native';

export default class SMSTimer {
    /**
     *
     * @param props
     */
    constructor(props) {
        this.props = props;
        // this.autoplayTimer=null;
        this.interval = null;
        this.defaultTimerNums = props.timerNums;
        this.timerNums = this.defaultTimerNums;
        this.isSuspend=false;
        if (!props.timerNums) {
            BizShowToast('props.timerNums 没传进来,设置 默认值')
            this.timerNums = 60;//默认 60秒
        }
    }


    start() {

        this.interval = setInterval(
            () => {
                if (this.isSuspend){
                    Log.log('isSuspend=true');
                    this.timerNums=0;
                }
                this.timerNums--;
                // Log.log('this.timerNum==  '+  this.timerNums )
                this.props.callBack(this.timerNums)
                if (this.timerNums <= 0) {
                    Log.log('clearInterval');

                    this.props.callBack(0);
                    this.timerNums = this.defaultTimerNums;
                    clearInterval(this.interval);
                }
            }, 1000
        );

        // this.autoplayTimer && clearTimeout(this.autoplayTimer);
        // if (this.props.timerNums<=0){
        //     showToast('this.props.timerNums<=0');
        //     return ;
        // }
        //
        // this.autoplayTimer = setTimeout(() => {
        //     this.props.timerNums--;
        //     Log.log('this.props.timerNum==  '+  this.props.timerNums )
        //     this.props.callBack(this.props.timerNums)
        // }, 1000)

        return this;

    }

    deallocInterval() {
        if (this.interval) {
            Log.log('deallocInterval');
            // this.timerNums=0;
            clearInterval(this.interval);
        }
    }
}
