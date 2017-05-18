/**
 * Created by os on 16/12/20.
 */
import React, { Component } from 'react';
import
{
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    TouchableHighlight
} from 'react-native'

import HeadBar from '../../components/HeadBar'
import { connect } from 'react-redux';
import * as clientModel from '../../Net/clientModel'
import { wndWidth } from '../../Global';
import { toastShort } from '../../utils/ToastUtil';
import userlogin from './user_login'
class find_passwd extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        // 初始状态
        this.state = {
            account_num: '',
            ver_num: '',
            new1_num: '',
            new2_num: ''
        };
    }


    render()
    {
        const { navigator } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
                <HeadBar
                    title='找回密码'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={navigator}
                    />
                <View style={styles.accoutView}>
                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='请输入手机号码'
                        maxLength={11}
                        keyboardType="numeric"
                        onChangeText={(account_num) => this.setState({ account_num })}
                        >
                    </TextInput>
                </View>

                <View style={styles.accoutView}>
                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='请输入新密码'
                        secureTextEntry={true}
                        onChangeText={(new1_num) => this.setState({ new1_num })}

                        >
                    </TextInput>
                </View>
                <View style={styles.accoutView}>
                    <TextInput style={styles.TextInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='再次输入新密码'
                        secureTextEntry={true}
                        onChangeText={(new2_num) => this.setState({ new2_num })}

                        ></TextInput>
                </View>
                <TouchableHighlight style={styles.findPasswordButton}
                    onPress={this.find_passwordAction.bind(this)}
                    >
                    <Text style={{ textAlign: 'center', fontSize: 20, color: '#ffffff', fontFamily: 'PingFang-SC-medium' }}> 确定 </Text>
                </TouchableHighlight>
            </View>
        )
    }
    find_passwordAction()
    {

        if (this.state.account_num.length === 11)
        {
            if ((this.state.new2_num > 5 || this.state.new2_num <= 20))
            {
                clientModel.pw_reset(this.state.account_num, this.state.ver_num, this.state.new2_num);
            } else
            {
                toastShort('密码是6-20位数字或字母')
            }

        } else
        {
            toastShort('请填写正确的手机号码')
        }
    }
    componentWillReceiveProps(nextProps)
    {
        if (nextProps.operateNotify && nextProps.operateNotify.indexOf('resetPwSuc') >= 0)
        {
            this.props.navigator.push({
                component: userlogin,
                name: 'userlogin',
                params: {
                    jumpID: 1
                }
            });
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
        height:133/2,
        flexDirection: 'row',
        marginTop: 16,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10

    },

    TextInputStyle: {
        width: wndWidth - 58,
        marginLeft: 5,
        fontSize: 18,
        height:40,
        textAlign:'center',
        justifyContent:'center',
    },
    findPasswordButton: {
        width: wndWidth - 40,
        height: 50,
        backgroundColor: '#02b3d3',
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 54 / 2,

    },

});
function select(store)
{
    return {
        operateNotify: store.userStore.operateNotify,
    }
}
export default connect(select)(find_passwd);
