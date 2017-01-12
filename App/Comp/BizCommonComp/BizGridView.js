// /**
//  * Created by Ebates on 17/1/12.
//  *
//  * 网格 布局, 里边可能 是 按钮,也可能是 图片
//  * 类似  https://github.com/ant-design/ant-design-mobile 这个库的  Flex 控件
//  */
// import React, {Component} from 'react';
// import {View, Image, Text} from 'react-native';
// import {Grid} from 'antd-mobile';
//
// const data = Array.from(new Array(9)).map((_val, i) => ({
//     icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png',
//     text: `名字${i}`,
// }));
//
// class BizGridView extends React.Component {
//     onPress() {
//
//     }
//
//     render() {
//         let {style, children, onPress} = this.props;
//
//         return (
//             <Flex style={[{
//                 flexDirection: 'row',
//                 flexWrap: 'wrap', justifyContent: 'space-between'
//             }, style]}>
//                 {children}
//             </Flex>
//
//         );
//     }
// }
// BizGridView.defaultProps = {};
// export default BizGridView;