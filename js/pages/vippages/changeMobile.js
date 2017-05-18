/**
 * Created by os on 16/12/19.
 */
/**
 * Created by os on 16/12/5.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';
import HeadBar from '../../components/HeadBar'
import {wndWidth} from "../../Global";


class changeemail extends Component{
    constructor(props) {
        super(props);
        this.state ={
            mobile:''
        };
    }

    _onRightEdit(){
        if (this.state.mobile){
            DeviceEventEmitter.emit('mobile',this.state.mobile);
            this.props.navigator.pop();
        }
    }
    render(){
        const {navigator} = this.props;
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:'#ffffff'}}>
                <View style={styles.container}>
                    <HeadBar
                        title='修改手机号码'
                        leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        rightText='保存'
                        rightClick  = {this._onRightEdit.bind(this)}
                        navigator = {navigator}
                    />
                </View>
                <TextInput
                    style={{color:'#303030',fontSize:17,backgroundColor:'#ffffff',borderColor:"#000000",borderBottomWidth:1,margin:14,height:40}}
                    placeholder="请输入手机号码"
                    maxLength = {11}
                    keyboardType="numeric"
                    underlineColorAndroid='transparent'
                    onChangeText={(mobile) => this.setState({mobile})}
                    value={this.state.mobile}
                />
            </View>
        )
    }

    componentDidMount() {
        this.setState({
            mobile:this.props.mobile
        })
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'transparent',
        position:'relative'
    },
});

module .exports = changeemail;