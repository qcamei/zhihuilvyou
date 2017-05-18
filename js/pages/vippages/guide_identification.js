/**
 * Created by os on 16/12/8.
 */
import React,{Component} from 'react'
import {Dimensions,
        Text,
    TextInput,
    TouchableHighlight,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Platform
}from 'react-native'

import HeadBar from '../../components/HeadBar'
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker'
import identificationmoreIcon from '../../imgs/icons/identification_more.png'
import * as clientModel from '../../Net/clientModel'
import defaultPhotoIcon from '../../imgs/icons/default_photo.png'
var FileUpload = require('NativeModules').FileUpload;
import {httpServerAdd} from '../../config';
import {toastShort} from '../../utils/ToastUtil'
import Toast from '@remobile/react-native-toast'

const {width: deviceWidth} = Dimensions.get('window');
var imageOptions = {
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '相册',
    maxWidth: 500,
    maxHeight: 500,
    quality: 1,
    allowsEditing: true
};

class guide_identification extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            error:'',
            ture_name:'',
            cert_id:'',
            cert_img:'',
            traval_office:'',
            isCheckPhoto:0,
        };
        this.lastSendTime = 0;
      }

    render(){
        const {navigator} = this.props;
        return(
            <View style={styles.backView}>
                <HeadBar
                    title ='导游认证'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator = {navigator}
                />
            <View style={[styles.backgroundView,{height:40}]}>
                <Text style={{marginLeft:10,fontSize:12,color:'#898989'}}>为保障你的资金安全及个人权益,请进行导游认证</Text>
            </View>
                <Text style={styles.titleView}>你的身份信息</Text>
             <View style={[styles.backgroundView,{marginTop:9}]}>
                 <Text style={styles.textStyle}>真实姓名</Text>
                 <TextInput style={styles.TextInputStyles}
                            placeholder='请输入您的真实姓名'
                            underlineColorAndroid='transparent'
                            onChangeText={(ture_name) =>this.setState({ture_name})}
                 >
                 </TextInput>
             </View>
             <View style={styles.viewLine}></View>
             <View style={styles.backgroundView}>
                 <Text style={styles.textStyle}>导游证号</Text>
                 <TextInput style={styles.TextInputStyles}
                            placeholder='请输入导游证号'
                            underlineColorAndroid='transparent'
                            onChangeText={(cert_id) =>this.setState({cert_id})}
                 ></TextInput>
             </View>
                <Text style={styles.titleView}>旅行社信息</Text>
              <View style={[styles.backgroundView,{marginTop:9}]}>
                  <Text style={styles.textStyle}>旅行社</Text>
                  <TextInput style={[styles.TextInputStyles,{width: deviceWidth-100,marginLeft:32}]}
                             placeholder='请填写所在旅行社名称'
                             underlineColorAndroid='transparent'
                             onChangeText={(traval_office) =>this.setState({traval_office})}
                  ></TextInput>
              </View>
                <View style={styles.viewLine}></View>
                <View style={styles.backgroundView}>
                    <Text style={styles.textStyle}>导游证件</Text>
                    <TouchableOpacity style={{marginLeft:23,width:30,height:28}} onPress={this._commitPhote.bind(this)}>
                        <Image style={{width:30,height:28}} source={defaultPhotoIcon}></Image>
                    </TouchableOpacity>
                    {this.state.isCheckPhoto==1?<Text style={{position:'absolute',right:15,color: 'blue',top:58/3}}>已选择</Text>:null}
                </View>
                <TouchableHighlight style= {styles.guideButton} onPress={this._checkGuideBtn.bind(this)}>
                    <Text style={{textAlign:'center',fontSize:20,color:'#ffffff',fontFamily:'PingFang-SC-medium'}}> 提交 </Text>
                </TouchableHighlight>
        </View>
        )
    }
    _commitPhote(){
        ImagePicker.showImagePicker(imageOptions, (response) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            }
            else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                if (Platform.OS === 'ios') {
                    let userface = response.uri.replace('file://', '');
                    this.uploadImage(userface);
                }else {
                    this.uploadImage(response.path);
                }
            }
        })
    }
    uploadImage(path) {
        let temp = path.split(".");
        let filename;
        if (temp.length > 1)
            filename = this.state.cert_id.toString() + "." + temp[temp.length - 1];
        var obj = {
            uploadUrl: httpServerAdd + "upload/guideimg",
            method: 'POST', // default 'POST',support 'POST' and 'PUT'
            headers: {
                'Accept': 'application/json',
            },
            fields: {
                'userid': filename,
            },
            files: [
                {
                    filename: filename, // require, file name
                    filepath: path, // require, file absoluete path
                },
            ]
        };
        let self = this;

        FileUpload.upload(obj, function (err, result) {
            if (err) {


                toastShort("图片上传失败！1")
            }
            else {
                try {
                    let data = JSON.parse(result.data);
                    if (data && data.status == 0) {
                        let userface = data.path + "?v=" + Math.round(Math.random() * 10000);
                        self.setState({
                            cert_img:userface,
                            isCheckPhoto:1
                        });
                    }
                    else {
                        toastShort("图片上传失败2");
                    }
                }
                catch (e) {
                    toastShort("图片上传失败3");
                }
            }
        })
    }

    _checkGuideBtn(){
        if(Date.now()-this.lastSendTime<1000)
            return;
        if (this.state.ture_name && this.state.cert_id && this.state.traval_office && this.state.cert_img){
            clientModel.guide_certifition(this.state.ture_name,this.state.cert_id,this.state.cert_img?this.state.cert_img:'',this.state.traval_office);
            this.lastSendTime = Date.now();
        }else {
            Toast.showShortBottom("不能为空");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.operateNotify && nextProps.operateNotify.indexOf('guideCertifition')>=0){
            this.props.navigator.pop();
        }
    }
}

const textHightView = 58; //cell的高度
const textFontsSize = 16; //字体大小


styles = StyleSheet.create({
    backView:{
        flex:1,
        backgroundColor:'#f3f4f6',
        flexDirection:'column'
    },
    backgroundView:{ //cell样式的背景
        backgroundColor:'#ffffff',
        flexDirection:'row',
        width:deviceWidth,
        height:textHightView,
        alignItems:'center'
    },
    titleView:{ //headView 的背景
        marginLeft:20,
        marginTop:9,
        fontSize:13,
        color:'#b5b5b5',
        width:80,
        height:16
    },
    textStyle:{ //文本样式
        marginLeft:20,
        color:'#313131',
        fontSize:textFontsSize,
    },
    viewLine:{ //淫荡的分割线
        height:0.5,
        width:deviceWidth,
        marginLeft:10,
        backgroundColor:'#d5d5d5'
    },
    TextInputStyles:{ //输入框样式
        marginLeft:16,
        width:deviceWidth/2,
        fontSize:15
},
    guideButton:{
        width:deviceWidth-40,
        height:49,
        backgroundColor:'#02b3d3',
        borderRadius:20,
        alignSelf:'center',
        justifyContent:'center',
        overflow:'hidden',
        marginTop:30,

    },
});

function select(store) {
    return {
        operateNotify: store.userStore.operateNotify
    }
}
export default connect(select)(guide_identification);