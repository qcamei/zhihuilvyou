/**
 * Created by os on 16/12/2.
 */
import React from 'react';

import{
    Component,
    StyleSheet,
    Image,
    Text,
    View
} from 'react-native';

import HeadBar from '../../components/HeadBar';
var Platform = require('react-native').Platform;
var ImagePicker = require('react-native-image-picker');

var options = {
    title: '选择方式',
    customButtons: [
        //{name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class checkphoto extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            avatarSource:require('../../imgs/icons/qyc.jpg')

        };
    }

    _onPressPhoto(){

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

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
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                if (Platform.OS === 'ios') {
                   const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    const source = {uri: response.uri, isStatic: true};
                }

                this.setState({
                    avatarSource: source
                });
            }
        })
    }
    render(){
        const { navigator } = this.props;
        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                    <HeadBar
                        title ='个人头像'
                        leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        rightText="更改"
                        rightClick = {()=>{this._onPressPhoto()}}
                        navigator = {navigator}
                    />

                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                <View>
                    <Image style={styles.imageframe} source={this.state.avatarSource}/>

                </View>
                </View>
            </View>
        )
    }
}
//require('../../imgs/icons/qyc.jpg')
const styles = StyleSheet.create({
        imageframe:{
            width:deviceWidth,
            height:deviceWidth-50,
            resizeMode:'cover',
        }
});
module .exports = checkphoto;