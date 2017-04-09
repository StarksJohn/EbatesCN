/**
 * http://tool.oschina.net/commons?type=3    RGB 颜色对照表
 * 如果用 MAC 系统 的 数码测色计 ,选 sRGB 和 UI 给的颜色一致
 */

export default  Colors = {
    lightGray: "#F0F0F0",
    lineGray: '#F0F0F0',
    white:'#FFFFFF',//'rgba(255, 255, 255, 1)'
    borderColor:'#dddddd',//一般用于 边框颜色|分割线 颜色
    green: '#80BD01',
    orange:'#FF730C',//'rgba(255, 115, 12, 1)'
    backGray: '#E5E5E5',
    textGray: '#C0C0C0', //'rgba(192, 192, 192, 1)',
    textBlack: '#333333',
    purple: '#9966CC',
    red: '#f61d4b',
    backWhite: '#F2F2F2',
    textGold: '#BC7233',
    // borderColor: '#E2E2E2',
    black: '#000000',
    BizCommonBlack:'#404040',// Ebates 中国 项目的 通用 黑色,也是'rgba(64, 64, 64, 1)'
    BizCommonGrayBack:'#F2F2F2',//'rgba(242, 242, 242, 1)',//Ebates 中国 项目的 通用 灰色背景
    blackTranslucent: 'rgba(0, 0, 0, 0.1)',//黑色半透明
    blue: '#3e9ce9',
    COMMON_SELECT_COLOR: 'rgba(255, 80, 0, 0.1)', //统一按下颜色
    COMMON_BACKGROUND_COLOR: '#F5FCFF', //统一背景颜色
    transparent: 'transparent',//全 透明 色
    DeepPink: '#FF1493',
    HotPink: '#FF69B4',
    appUnifiedBackColor: '#49B954',//'rgba(73, 185, 84, 1)',//app统一背景色
    halfOpacityAppUnifiedBackColor: 'rgba(67, 187, 78, 0.5)',//app统一背景色的50%透明度
    backPopBtColor:'#626770',
    allNavTitleColor:'#404040',//所有导航栏标题颜色
    blackText:'#555555',//app里大部分 黑色 文字
    commonBorderColor:'#E4E4E4',//通用的 边框颜色

    /**
     * 随即色
     * @returns {string}
     */
    getRandomColor() {

        return '#' +
            (function (color) {
                return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);//如果 本文件 'use strict';  此处的 callee 就报错
            })('');
    },
    /**
     * 得到任意透明度的颜色值
     * @param str_rgbValue_R string
     * @param str_rgbValue_G
     * @param str_rgbValue_B
     * @param str_alpha
     * @returns {string}
     */
    translucentColor (str_rgbValue_R, str_rgbValue_G, str_rgbValue_B, str_alpha){

        let value = `rgba(${str_rgbValue_R}, ${str_rgbValue_G} , ${str_rgbValue_B} , ${str_alpha} )`;
        return value;
    },
}

/**
 * 得到任意透明度的颜色值
 * @param str_rgbValue_R
 * @param str_rgbValue_G
 * @param str_rgbValue_B
 * @param str_alpha
 * @returns {string}
 */
// export const translucentColor = (str_rgbValue_R, str_rgbValue_G, str_rgbValue_B, str_alpha)=> {
//
//     let value = `rgba(${str_rgbValue_R}, ${str_rgbValue_G} , ${str_rgbValue_B} , ${str_alpha} )`;
//     return value;
// };

/**
 * 随即色
 * @returns {string}
 */
// export const getRandomColor = ()=> {
//
//     return '#' +
//         (function (color) {
//             return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
//             && (color.length == 6) ? color : arguments.callee(color);
//         })('');
// }

