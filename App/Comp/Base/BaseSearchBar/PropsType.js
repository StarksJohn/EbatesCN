import React from 'react';

"use strict";
function noop() { }
exports.defaultProps = {
    prefixCls: 'am-search',
    placeholder: '',
    onSubmit: noop,
    onChange: noop,
    // onFocus: noop,
    onBlur: noop,
    onClear: noop,
    showCancelButton: false,
    cancelText: '取消',
    disabled: false,
    returnKeyType:'go',
    customContainerStyle: {},
    customSearchStyle: {},
    defaultPaddingRight:15,
    onFocusPaddingRight:0,
};