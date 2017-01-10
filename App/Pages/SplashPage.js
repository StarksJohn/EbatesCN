/**
 * 启动页面
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated} from 'react-native';
// import {AppName} from '../constants/GlobalConst'
import Colors from '../Utils/Colors'


class SplashPage extends Component {

	constructor(props) {
    super(props);

    this.state = {
    	fadeAnim: new Animated.Value(0),
    	fadeAnimOther: new Animated.Value(0),
    	fadeAnimContainer: new Animated.Value(1),
  	};
  }

  componentDidMount() {
  	this._inAnim(() => {
  	  setTimeout(() => {
      	this._outAnim(() => this.props.onAnimEnd && this.props.onAnimEnd());
    	}, 100);
  	});
	}

  render() {
  	let transformTitle2 = [
  		{
  			translateX: this.state.fadeAnimOther.interpolate({inputRange: [0, 1], outputRange: [50, 0]}),
  		}
  	];

  	let transformTitle3 = [
  		{
  			translateY: this.state.fadeAnimOther.interpolate({inputRange: [0, 1], outputRange: [150, 0]}),
  		}
  	];
    return (
    	<Animated.View style={[styles.container, this.props.style, {opacity: this.state.fadeAnimContainer}]}>
        <Animated.View style={{opacity: this.state.fadeAnim}}>
      	  <Text style={styles.text1}>Ebates 中国</Text>
      	</Animated.View>
            {
                /*
                 <Animated.View style={{opacity: this.state.fadeAnimOther, transform: transformTitle2}}>
                 <Text style={styles.text2}>每日分享宝宝们最喜欢吃的美食</Text>
                 </Animated.View>

                 <Animated.View style={{opacity: this.state.fadeAnimOther, transform: transformTitle3}}>
                 <Text style={styles.text3}>微信搜索:txmm568</Text>
                 </Animated.View>
                 */

            }

      </Animated.View>
    );
  }

  _inAnim(callback) {
  	Animated.sequence([
  		Animated.timing(this.state.fadeAnim,  {
    		toValue: 1,
    		duration: 100,
    	}),
    	Animated.timing(this.state.fadeAnimOther,  {
    		toValue: 1,
    		duration: 100,
    	}),
  	]).start(() => callback && callback()); 
  }

  _outAnim(callback) {
  	Animated.sequence([
  		Animated.timing(this.state.fadeAnim,  {
    		toValue: 0,
    		duration: 100,
    	}),
    	Animated.timing(this.state.fadeAnimOther,  {
    		toValue: 0,
    		duration: 100,
    	}),
    	Animated.timing(this.state.fadeAnimContainer,  {
    		toValue: 0,
    		duration: 100,
    	}),
  	]).start(() => callback && callback()); 
  }

}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.appUnifiedBackColor,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text1: {
		color: '#FFFFFF',
		fontSize: 28,
		fontWeight: 'bold',
	},
	text2: {
		color: '#D3D3D3',
		fontSize: 15,
        marginTop: 30,
	},
	text3: {
		color: '#D3D3D3',
		fontSize: 18,
		marginTop: 30,
	}
});


export default SplashPage;