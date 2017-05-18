/**
 * Created by os on 16/12/8.
 */
import React, { Component } from 'react'
import
{
    View,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Image,
    Text,
    StyleSheet,
} from 'react-native'

import HeadBar from '../../components/HeadBar'
import { connect } from 'react-redux';
import * as clientModel from '../../Net/clientModel'
import { toastShort } from '../../utils/ToastUtil';
import resetAccountIcon from '../../imgs/icons/login_account@2x.png'
import resetPassword from '../../imgs/icons/login_password@2x.png'
import userlogin from './user_login'
import { wndWidth } from "../../Global";

class reset_password extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        // 初始状态
        this.state = {
            oldPsd: '',
            newPsdOne: '',
            newPsdTwo: '',
        };
    }

    render()
    {
        const {navigator} = this.props;
        return (
            <View style={styles.backView}>
                <HeadBar
                    title='修改密码'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={navigator}
                    />
                <View style={styles.accoutView}>
                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='请输入旧密码'
                        secureTextEntry={true}
                        onChangeText={(oldPsd) => this.setState({ oldPsd })}
                        >
                    </TextInput>
                </View>
                <View style={styles.accoutView}>

                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='请输入新密码'
                        secureTextEntry={true}
                        onChangeText={(newPsdOne) => this.setState({ newPsdOne })}

                        >
                    </TextInput>
                </View>
                <View style={styles.accoutView}>
                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='再次输入新密码'
                        secureTextEntry={true}
                        onChangeText={(newPsdTwo) => this.setState({ newPsdTwo })}

                        ></TextInput>
                </View>

                <TouchableHighlight style={styles.resetPasswordButton}
                    onPress={this.reset_passwordAction.bind(this)}
                    >
                    <Text style={{ textAlign: 'center', fontSize: 20, color: '#ffffff', fontFamily: 'PingFang-SC-medium' }}> 确定 </Text>
                </TouchableHighlight>
            </View>
        )
    }
    reset_passwordAction()
    {
        if (this.state.newPsdTwo.length > 5 && this.state.newPsdTwo.length <= 20)
        {
            if (this.state.newPsdOne === this.state.newPsdTwo)
            {
                clientModel.pw_change(this.state.oldPsd, this.state.newPsdTwo);
            } else
            {
                toastShort('两次密码不统一')
            }
        } else
        {
            toastShort('密码是6-20位数字或字母')
        }

    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.operateNotify && nextProps.operateNotify.indexOf('changePwSuc') >= 0)
        {
            this.props.navigator.pop()
        }
    }
}


const styles = StyleSheet.create({
    backView: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        flexDirection: 'column',
    },
    accoutView: {
        backgroundColor: '#ffffff',
        width: wndWidth - 32,
        height: 117.3 / 2,
        flexDirection: 'row',
        marginTop: 26 / 2,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10

    },

    TextInputStyle: {
        width: wndWidth - 58,
        marginLeft: 5,
        //color:'#d5d5d5',
        fontSize: 16,
        //textColor:
    },
    resetPasswordButton: {
        width: wndWidth - 40,
        height: 50,
        backgroundColor: '#02b3d3',
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: 54 / 2,

    },
});
function select(store)
{
    return {
        operateNotify: store.userStore.operateNotify,
    }
}

export default connect(select)(reset_password);
