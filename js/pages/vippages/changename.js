/**
 * Created by os on 16/12/5.
 */
import React, { Commonent } from 'react';
import { TextInput, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import personPage from './personalInformation'
import HeadBar from '../../components/HeadBar';
import { toastShort } from '../../utils/ToastUtil'

class changename extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { text: '' };
    }
    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#f3f4f6' }}>
                <View style={styles.container}>
                    <HeadBar
                        title='昵称'
                        leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        rightText='保存'
                        rightClick={this._onPressSure.bind(this)}
                        navigator={navigator}
                        />
                </View>
                <TextInput
                    style={{ height: 50, color: '#303030', fontSize: 17, backgroundColor: '#ffffff', marginTop: 14 }}
                    placeholder='请填写昵称'
                    underlineColorAndroid='transparent'
                    value={this.state.text}
                    onChangeText={(text) => this.setState({ text })}

                    />
            </View>
        )
    }
    _onPressSure()
    {
        if (this.state.text.length <= 8 && this.state.text.length >= 2)
        {
            DeviceEventEmitter.emit('text', this.state.text);
            this.props.navigator.pop();
        } else
        {
            toastShort('昵称长度为2-8个字')
        }


    }

    componentDidMount()
    {
        this.setState({

            text: this.props.text
        })
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative'
    },
});

module.exports = changename;