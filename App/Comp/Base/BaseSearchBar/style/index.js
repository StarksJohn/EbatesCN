'use strict';
import {
     Platform
} from 'react-native';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _default = require('./default');

var _default2 = _interopRequireDefault(_default);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { "default": obj };
}

exports["default"] = _reactNative.StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff', //'#ddd',@cham 为了Ebates 项目 的UI而改
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: _default2["default"].h_spacing_md+8,
        paddingRight: _default2["default"].h_spacing_md+8,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    input: {
        borderRadius: 2, //_default2["default"].radius_md,@cham 为了Ebates 项目 的UI而改
        backgroundColor:'rgba(236, 236, 236, 1)', //'#fff',@cham 为了Ebates 项目 的UI而改
        borderColor: _default2["default"].border_color_base,
        borderWidth: 0, //_default2["default"].border_width_sm,@cham 为了Ebates 项目 的UI而改
        alignSelf: 'stretch',
        height: _default2["default"].search_bar_input_height,
        color: _default2["default"].color_text_base,
        fontSize: _default2["default"].font_size_base,
        paddingLeft: _default2["default"].h_spacing_lg + _default2["default"].icon_size_xxs + _default2["default"].h_spacing_sm-10,
        paddingRight: _default2["default"].h_spacing_lg + _default2["default"].icon_size_xxs + _default2["default"].h_spacing_sm,
        flex: 1,
        paddingTop: 2,
        paddingBottom: 0,
        // placeholdertTextColor:Colors.appUnifiedBackColor,
    },
    cancelTextContainer: {
        height: _default2["default"].search_bar_input_height,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'yellow'
    },
    cancelText: {
        fontSize: _default2["default"].link_button_font_size,
        color: _default2["default"].color_link,
        paddingLeft: _default2["default"].h_spacing_lg
    },
    search: {
        tintColor: _default2["default"].input_color_icon,
        position: 'absolute',
        left: _default2["default"].h_spacing_md + 17,//默认 37
        top: (_default2["default"].search_bar_input_height - _default2["default"].icon_size_xxs) / 2 + (Platform.OS=='ios'?1:1),
        width: _default2["default"].icon_size_xxs,
        height: _default2["default"].icon_size_xxs
    }
});
module.exports = exports['default'];