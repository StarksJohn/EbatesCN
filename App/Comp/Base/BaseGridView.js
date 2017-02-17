/**
 * 网格view,可 外部自定义 绘制每个 格子的逻辑
 * 借鉴 曹神的 reading
 */
import React, {PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ListView
} from 'react-native';

const propTypes = {
    items: PropTypes.array,
    renderItem: PropTypes.func,
    containerStyle: View.propTypes.style,
};

/**
 *
 * @param items 原始数据源 [{},{}...]
 * @param renderItem 外部绘制 item
 * @param containerStyle 外部自定义容器的style
 * @constructor
 */
const BaseGridView = ({
    items,
    renderItem,
    containerStyle
}) => {

    /**
     * 画所有的 格子
     * @param groups
     */
    const renderGroups = (items)=> {
        const itemViews = items.map((model) => {
            const i = renderItem(model);//外部绘制每个cell里的 格子
            return i;
        });
        return (
            //画容器
            <View style={[styles.container,containerStyle]}>
                {itemViews}
            </View>
        );
    };

    return (
        renderGroups(items)
    );
};

const styles = StyleSheet.create({
    container:{//最大的容器 默认
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    }
});

BaseGridView.propTypes = propTypes;

BaseGridView.defaultProps = {
    items: [],
    renderItem: null,
    containerStyle: undefined,
};

export default BaseGridView;
