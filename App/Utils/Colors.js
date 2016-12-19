/**
 * http://tool.oschina.net/commons?type=3    RGB 颜色对照表
 */

export default  Colors = {
    lightGray: "#F0F0F0",
    lineGray: '#F0F0F0',
    borderColor:'#dddddd',//一般用于 边框颜色|分割线 颜色
    green: '#80BD01',
    orange:'#FFA500',
    backGray: '#E5E5E5',
    textGray: '#9A9A9A',
    textBlack: '#333333',
    purple: '#9966CC',
    red: '#f61d4b',
    backWhite: '#F2F2F2',
    textGold: '#BC7233',
    // borderColor: '#E2E2E2',
    black: '#586872',
    blackTranslucent: 'rgba(0, 0, 0, 0.1)',//黑色半透明
    blue: '#3e9ce9',
    white: "white",
    COMMON_SELECT_COLOR: 'rgba(255, 80, 0, 0.1)', //统一按下颜色
    COMMON_BACKGROUND_COLOR: '#F5FCFF', //统一背景颜色
    transparent: 'transparent',//全透明色111
    DeepPink: '#FF1493',
    HotPink: '#FF69B4',
    appUnifiedBackColor: 'rgba(67, 187, 78, 1)',//app统一背景色
    // RandomColor: this.getRandomColor,
    /**
     * 随即色
     * @returns {string}
     */
    getRandomColor() {

        return '#' +
            (function (color) {
                return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
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

