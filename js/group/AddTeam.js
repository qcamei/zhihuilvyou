import React, { Component } from 'react';
import
{
    View,
    Image,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    Platform,
    ToastAndroid



} from 'react-native'
let mT = (Platform.OS === 'android' && Platform.Version <= 19) ? 0 : (Platform.OS === 'android' ? 24 : 0);

import HeadBar from '../components/HeadBar'
import { connect } from 'react-redux'
import * as clientModel from '../Net/clientModel'
import {infoLoaded,wndHeight,wndWidth} from "../Global";
var ImagePicker = require('react-native-image-picker');
import { httpServerAdd } from '../config';
import { toastShort } from '../utils/ToastUtil'
var FileUpload = require('NativeModules').FileUpload;
var imageOptions = {
    title: '选择头像',
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '相册',
    maxWidth: 500,
    maxHeight: 500,
    quality: 1,
    allowsEditing: true,
    
};
class AddTeam extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            teamname: '',
            teamface: '',

        };
        this.isRequest=false;

    }

    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f3f4f6', flexDirection: 'column' }}>
                <HeadBar
                    title='创建团队'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText='返回'
                    rightText='确定'
                    rightClick={() => { this.submitinfo() } }
                    navigator={navigator}
                    />
                <View style={{ height: wndHeight * 0.3, width: wndWidth, justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity onPress={() => this._onPressPhoto()}>
                        <Image source={!this.state.teamface || this.state.teamface == "" ? require('../imgs/icons/btn_addteam.png') : { uri: httpServerAdd + this.state.teamface }} style={{ width: 80, height: 80 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 10, height: 60, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 8}}>

                    <TextInput style={{ textAlign: 'center' , width: wndWidth - 20,ontSize: 16,height: 60}}
                               placeholder="请输入团队名称"
                               underlineColorAndroid='transparent'
                               onChangeText={(input) => { this.setState({ teamname: input }) } }
                               autoCorrect={false}
                               clearButtonMode='always'
                    ></TextInput>

                </View>
            </View>
        )
    }
    submitinfo()
    {
        this.isRequest=true;
        if (this.state.teamname.trim() != '' && this.state.teamname.length<=10)
        { 
            clientModel.add_team({ name: this.state.teamname, icon: this.state.teamface })

        } else if(this.state.teamname.trim() == '')
        {
            ToastAndroid.show('团队名称不能为空', ToastAndroid.SHORT)

        }else if(this.state.teamname.length>10){
             ToastAndroid.show('团队名称不能超过10个字，表情为2个字', ToastAndroid.SHORT)
        }

    }
    
    componentWillReceiveProps(nextProps){
         if(nextProps && nextProps.operateNotify && nextProps.operateNotify.indexOf('addteam')>=0)
         {
             this.isRequest=false;
             this.props.navigator.pop();
         }
    }
    _onPressPhoto()
    {

        ImagePicker.showImagePicker(imageOptions, (response) =>
        {
            if (response.didCancel)
            {
                // console.log('User cancelled image picker');
            }
            else if (response.error)
            {
                // console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton)
            {
                // console.log('User tapped custom button: ', response.customButton);
            }
            else
            {
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

    uploadImage(path)
    {
        let temp = path.split(".");
        let filename;
        if (temp.length > 1)
            filename = this.props.user.userid.toString() + "." + temp[temp.length - 1];
        var obj = {
            uploadUrl: httpServerAdd + "upload/groupicon",
            method: 'POST', // default 'POST',support 'POST' and 'PUT'
            headers: {
                'Accept': 'application/json',
            },
            fields: {
                'userid': filename,
            },
            files: [
                {
                    // name: this.props.user.userid, // optional, if none then `filename` is used instead
                    filename: filename, // require, file name
                    filepath: path, // require, file absoluete path
                    // filetype: 'images', // options, if none, will get mimetype from `filepath` extension
                },
            ]
        };
        let self = this;

        FileUpload.upload(obj, function (err, result)
        {
            if (err)
            {

                toastShort("图片上传失败！1")
            }
            else
            {
                try
                {
                    let data = JSON.parse(result.data);
                    if (data && data.status == 0)
                    {

                        self.setState({ teamface: data.path })
                    }
                    else
                    {
                        toastShort("图片上传失败2");
                    }
                }
                catch (e)
                {
                    toastShort("图片上传失败3");
                }
            }
        })
    }

}
const styles = StyleSheet.create({
});
function select(store)
{
    return {
        operateNotify:store.userStore.operateNotify,
        user: store.userStore.user,
    }
}
export default connect(select)(AddTeam);