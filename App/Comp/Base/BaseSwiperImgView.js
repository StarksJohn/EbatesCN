/**
 * 轮播图控件 https://github.com/leecade/react-native-swiper
 * BaseSwiperImgView
 */

import React, {Component, PropTypes} from 'react'
import {
    Text,
    View,
    Image,
    Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper'
const {width} = Dimensions.get('window')
// const loading = require('./img/loading.gif')
import Colors from '../../Utils/Colors'


const Slide = props => {
    return (<View style={styles.slide}>
        <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={{uri: props.uri}}/>
        {/*菊花*/}
        {
            !props.loaded  && props.renderLoadingView &&
            <View style={styles.loadingView}>
                {/*<Image style={styles.loadingImage} source={loading}/>*/}
                {props.renderLoadingView()}
            </View>
        }
    </View>)
}

export default class BaseSwiperImgView extends Component {
    static propTypes = {
        containerStyle: View.propTypes.style,
        height: PropTypes.number.
        renderLoadingView=PropTypes.func,
    };

    static defaultProps = {
        containerStyle: {},
        height: 100,
        renderLoadingView:()=>{},
    };


    constructor(props) {
        super(props)
        this.state = {
            imgList: props.imgList,
            loadQueue: [0, 0, 0, 0]
        }
        this.loadHandle = this.loadHandle.bind(this)
    }

    loadHandle(i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
    }

    render() {
        return (
            <Swiper loadMinimal loadMinimalSize={4} style={this.props.containerStyle} height={this.props.height}
                    loop={true} paginationStyle={{
                bottom: 10,
                //backgroundColor: Colors.getRandomColor()
            }} activeDotColor={Colors.BizCommonBlack}>
                {
                    this.state.imgList.map(
                        (item, i) => {
                            return <Slide
                                loadHandle={this.loadHandle}
                                loaded={!!this.state.loadQueue[i]}
                                uri={item}
                                i={i}
                                key={i}
                                renderLoadingView={this.props.renderLoadingView}
                            />
                        })
                }
            </Swiper>
        )
    }
}

const styles = {
    wrapper: {},

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width,
        flex: 1,
        backgroundColor: 'transparent'
    },

    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: Colors.white,//'rgba(0,0,0,.5)'
    },

    loadingImage: {
        width: 60,
        height: 60
    }
}
