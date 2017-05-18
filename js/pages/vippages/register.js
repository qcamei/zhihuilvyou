/**
 * Created by os on 16/12/7.
 */
import React,{Component} from 'react'
import {View,
        TextInput,
        Image,
    TouchableHighlight,
    TouchableOpacity,
        StyleSheet,
        Text
} from 'react-native'
import HeadBar from '../../components/HeadBar';
import * as clientModel from '../../Net/clientModel'
import user_login from './user_login'
import { connect } from 'react-redux'
import loginAccountIcon from '../../imgs/icons/login_account@2x.png'
import loginPasswordIcon from '../../imgs/icons/login_password@2x.png'
import registerIcon from '../../imgs/icons/register_show@2x.png'
// import false_checkICon from '../../imgs/icons/false_chenk@2x.png'
import {toastShort} from '../../utils/ToastUtil';
import ItemCheckbox from 'react-native-item-checkbox'

import {wndWidth} from "../../Global";

class register extends React.Component{
        // 构造
          constructor(props) {
            super(props);
            // 初始状态
            this.state = {
                data:'',
                phone_number:'',
                verify_code:'',
                passwd:'',
                regtype:1,           //注册类型
                isSecureTextHiddeen:true,   //是否明文显示密码
            };
          }
    render(){
        const {navigator} = this.props;
        return(
            <View style = {{flex:1,backgroundColor:'white',flexDirection:'column'}}>
                <HeadBar
                    title ='注册'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator = {navigator}
                />

                <View style={styles.ViewAccount}>
                    <Image style={styles.ImageStyle}
                           source={loginAccountIcon}
                    />
                    <TextInput style={styles.TextinputStyle}
                               placeholder="请输入手机号码"
                               maxLength = {11}
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               onChangeText ={(phone_number) => this.phone_number=phone_number}

                    />
                </View>
                <View style={styles.viewLine}></View>
                
                <View style={styles.ViewPassword}>
                    <Image style={styles.ImageStyle}
                           source={loginPasswordIcon}/>
                    <TextInput style={styles.TextinputStyle}
                               placeholder="请输入密码"
                               underlineColorAndroid='transparent'
                               secureTextEntry={this.state.isSecureTextHiddeen}
                               onChangeText={(passwd)=>this.passwd=passwd}
                    />
                    <TouchableOpacity style={{width:22,height:22,marginLeft:10}} onPress={this._onPreSecureText.bind(this)}>
                        <Image
                               source={registerIcon}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewLine}></View>
                <TouchableHighlight style= {styles.RegisterButton} onPress={this._onPressRegister.bind(this)}>
                    <Text style={{textAlign:'center',fontSize:20,color:'#ffffff',fontFamily:'PingFang-SC-medium'}}> 注册 </Text>
                </TouchableHighlight>
                <View style={{width:wndWidth-40,height:20,flexDirection:'row',marginTop:24,marginLeft:10}}>
                    <Text style={{width:120,fontSize:16,fontFamily:'PingFang-SC-medium',color:'#b5b5b5',textAlign:'right'}}>点击注册即同意</Text>
                    <TouchableOpacity style= {{width:150,marginBottom:44,height:20}}>
                        <Text style={{width:150,height:20,textAlign:'left',fontSize:16,color:'#02b3d3',fontFamily:'PingFang-SC-medium'}}>《注册服务协议》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //是否明文显示
    _onPreSecureText(){
        if(this.state.isSecureTextHiddeen == true){
            this.setState({
                isSecureTextHiddeen:false
            })
        }else {
            this.setState({
                isSecureTextHiddeen:true
            })
        }

    }

    componentWillReceiveProps(nextprops){
        if (nextprops.operateNotify && nextprops.operateNotify.indexOf("registerSuc")>=0){
            this.props.navigator.push({
                component:user_login,
                name:'user_login',
                params:{
                    jumpID:1
                }
            });
        }
    }

    _onPressRegister(){
         
            if(this.phone_number && this.phone_number.length === 11){
                if (this.passwd && this.passwd.length>5 || this.passwd<= 20){

                    clientModel.register(this.phone_number,this.verify_code,this.passwd,this.state.regtype)
                }else {
                    toastShort('密码是6-20位数字或字母')
                } 
            }else {
                toastShort('请检查手机号码是否正确')
            }


    }
}

const styles = StyleSheet.create({
    ImageIcon:{
        width:30,
        height:30,

    },
    ViewAccount:{
        width:wndWidth,
        flexDirection:'row',
        marginTop:50,
        alignItems:'center'
    },
    ViewPassword:{
        width:wndWidth,
        flexDirection:'row',
        alignItems:'center',
        marginTop:15
    },
    TextinputStyle:{
        marginLeft:10,
        width:wndWidth-140,
        height:40,
    },
    ImageStyle:{
        width:24,
        height:24,
        marginLeft:36
    },
    RegisterButton:{
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

function select(store)
{
    return {
        operateNotify:store.userStore.operateNotify,
    }
}

export default connect(select)(register);
