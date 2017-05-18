/**
 * Created by os on 16/12/5.
 */
import React,{ Component } from 'react';
import {
        View,
        Image,
        TextInput,
        TouchableHighlight,
    TouchableOpacity,
        StyleSheet,
        Text
} from 'react-native'
import { connect } from 'react-redux';
import HeadBar from '../../components/HeadBar';
import Register from './register';
import find_passwd from './find_passwd';
import {toastShort} from '../../utils/ToastUtil';
import * as clientModel from '../../Net/clientModel'
import AppIcon from '../../imgs/ic_launcher.png'
import loginAccountIcon from '../../imgs/icons/login_account@2x.png'
import loginPasswordIcon from '../../imgs/icons/login_password@2x.png'
import main from '../Main'
import {wndWidth} from '../../Global';
import { isEqual } from '../../utils/CommonUtil';

class user_login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error:0,
            id:this.props.id,
            loginText:'',
            loginPassword:'',
            valiType:1,
            jumpID:''

        };
    }

    _onPressRegister(){
        const  { navigator } = this.props;
        navigator.push({
            component:Register,
            name:'Register'
        })
    }

    _onPressForgetPassword(){
        this.props.navigator.push({
            component:find_passwd,
            name:'find_passwd'
        })
    }

    render(){
        const  { navigator } = this.props;
        return(
            <View style = {{flex:1,backgroundColor:'white',flexDirection:'column'}}>
                <HeadBar
                    title ='登录'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    leftClick={this._pop.bind(this)}
                    //navigator = {navigator}
                />

                <View style={{marginTop:46,width:wndWidth,height:68 ,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:68,height:68,borderRadius:5}}
                           source={AppIcon}
                    />
                </View>
                <View style={styles.View}>
                    <Image style={styles.ImageStyle}
                           source={loginAccountIcon}
                    />
                    <TextInput style={styles.TextinputStyle}
                               placeholder="请输入手机号码"
                               maxLength = {11}
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               onChangeText={(loginText) =>this.setState({loginText})}
                    />
                </View>
                <View style={styles.viewLine}></View>
                <View style={[styles.View,{marginTop:16}]}>
                    <Image style={styles.ImageStyle}
                           source={loginPasswordIcon}/>
                    <TextInput style={styles.TextinputStyle}
                               placeholder="请输入密码"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(loginPassword)=>this.setState({loginPassword})}

                    />
                </View>
                <View style={styles.viewLine}></View>
                <TouchableOpacity style= {styles.loginButton} onPress = {this._onPressLogin.bind(this)}>
                    <Text style={{textAlign:'center',fontSize:20,color:'#ffffff',fontFamily:'PingFang-SC-medium'}}> 登录 </Text>
                </TouchableOpacity>
                
                <View style={{flex:1}}>
                <View style={{height:20,flexDirection:'row',justifyContent:'center',position: 'absolute',bottom:44,width:wndWidth}}>
                    <Text style={{textAlign:'right',width:60,height:20,fontSize:16,fontFamily:'PingFang-SC-medium',color:'#02b3d3'}}>新用户?</Text>
                    <TouchableOpacity style= {{width:60,height:20}} onPress = {this._onPressRegister.bind(this)}>
                        <Text style={{width:60,height:20,textAlign:'left',fontSize:16,color:'#02b3d3',fontFamily:'PingFang-SC-medium'}}> 请注册 </Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        )
    }
    // <View style={{width:wndWidth,height:20,flexDirection:'row',justifyContent:'center',marginTop:20}}>
    //                 <TouchableOpacity style={{width:80,height:20,flexDirection:'row',justifyContent:'center'}}
    //                                   onPress={this._onPressForgetPassword.bind(this)}>
    //                     <Text style={{width:80,height:20,fontSize:16,fontFamily:'PingFang-SC-medium',color:'#02b3d3',textAlign:'center'}}>忘记密码?</Text>
    //                 </TouchableOpacity>
    //             </View>
    //登录请求
    _onPressLogin(){

        if(this.state.loginText.length === 11){
            if (this.state.loginPassword.length>5 || this.state.loginPassword<= 20){
                clientModel.login(this.state.loginText,this.state.loginPassword,this.state.valiType);
            }else {
                toastShort('密码是6-20位数字或字母')
            }
        }else {
            toastShort('请检查手机号码是否正确')
        }



    }
//,alignItems:'flex-end' <View style={{flexDirection:'row',justifyContent:'center',backgroundColor:'red',marginBottom:22}}>
    componentWillReceiveProps(nextprops) {
        if (nextprops.error==0){
            this.props.navigator.popToTop();
        }
    }
    componentDidMount() {
        this.setState({
            jumpID:this.props.jumpID
        })
    }

    _pop(){

        if (this.state.jumpID == 1){
            this.props.navigator.popToTop()

        }else {

            this.props.navigator.pop();
        }
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if (isEqual(nextState, this.state) && isEqual(nextProps.error,this.props.error))
        {
            return false;
        }
        return true;
    }
}

const styles = StyleSheet.create({
    ImageIcon:{
        width:30,
        height:30,
    },
    View:{
        width:wndWidth,
        flexDirection:'row',
        marginTop:30,
        alignItems:'center',
        height:40
    },
    TextinputStyle:{
        marginLeft:10,
        width:wndWidth-140,
        borderColor:'white',
        textAlign:'center',
        fontSize:16,
        height:40
    },
    ImageStyle:{
        width:24,
        height:24,
        marginLeft:36
    },

    loginButton:{
        width:wndWidth-40,
        height:50,
        backgroundColor:'#02b3d3',
        borderRadius:10,
        alignSelf:'center',
        justifyContent:'center',
        overflow:'hidden',
        marginTop:30,
    },
    viewLine:{
        height:0.5,
        width:wndWidth-60,
        marginLeft:30,
        backgroundColor:'#d5d5d5'
    },

});

function select(store) {
    return {
        error: store.userStore.user.error,
        id: store.userStore.user.id
    }
}
export default connect(select)(user_login);