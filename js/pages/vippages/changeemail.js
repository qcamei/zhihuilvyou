/**
 * Created by os on 16/12/5.
 */
import React,{Component} from 'react';
import {
        StyleSheet,
        View,
        Text,
        TextInput,
        TouchableHighlight
} from 'react-native';
import HeadBar from '../../components/HeadBar'


class changeemail extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            text:''
        };
    }
    _onPressSend(){
        alert('重新发送邮件')
    }
    _onRightEdit(){
        alert('なると')
    }
    render(){
        const {navigator} = this.props;
        return(
            <View style={{flex:1}}>
                <View style={styles.container}>
                    <HeadBar
                        title='修改邮箱地址'
                        actions={[{show:'text',title:"编辑"}]}
                        navigator = {navigator}
                        onActionSelected={this._onRightEdit}
                    />
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1.5,marginTop:20}}
                        placeholder="请输入邮箱地址"
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                    <Text style={{height:14,textAlign:'center',marginTop:20}}>该邮箱还未验证，请登录您的邮箱查收邮件并验证</Text>
                </View>
                <TouchableHighlight style= {styles.exitButton} onPress = {this._onPressSend.bind(this)}>
                    <Text style={{textAlign:'center',fontSize:18,color:'white'}}> 重新发送验证按钮 </Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'transparent',
        position:'relative'
    },
    exitButton:{
        width:160,
        height:40,
        backgroundColor:'#7CFC00',
        borderRadius:20,
        alignSelf:'center',
        justifyContent:'center',
        overflow:'hidden',
        marginTop:30
    },
});

module .exports = changeemail;