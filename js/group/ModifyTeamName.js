/**
 * Created by os on 16/12/5.
 */
import React, { Commonent } from 'react';
import { TextInput, StyleSheet, View, DeviceEventEmitter } from 'react-native';

import HeadBar from '../components/HeadBar';
import { toastShort } from '../utils/ToastUtil'
import { connect } from 'react-redux';
import TeamList from './TeamList'
import * as clientModel from '../Net/clientModel';
class ModifyTeamName extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { text: '' };
    }
    componentDidMount()
    {


        
        if (this.props.team_list)
        {
            for (let i = 0; i < this.props.team_list.length; i++)
            {
                if (this.props.team_list[i].id == this.props.id)
                {
                    this.setState({ text: this.props.team_list[i].name })
                }
            }
        }


    }
    render()
    {
        const {navigator} = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#f3f4f6' }}>
                <View style={styles.container}>
                    <HeadBar
                        title='团队名称'
                        leftIcon={require('../imgs/icons/backIcon@2x.png')}
                        leftText="返回"
                        rightText='确定'
                        rightClick={() => this.rightClick()}
                        navigator={navigator}
                        />
                </View>
                <TextInput
                    style={{ height: 50, color: '#303030', fontSize: 17, backgroundColor: '#ffffff', marginTop: 14 }}
                    placeholder='请填写名称'
                    underlineColorAndroid='transparent'
                    value={this.state.text}
                    onChangeText={(text) => this.setState({ text })}

                    />
            </View>
        )
    }
    componentWillReceiveProps(nextProps)
    {
        const {navigator} = this.props;
        if (nextProps && nextProps.operateNotify && nextProps.operateNotify.indexOf('modify_teamname') >= 0)
        {
            navigator.pop();
            
        }
    }

     
    rightClick()
    {

        clientModel.modify_teamname({ id: this.props.id, name: this.state.text })

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative'
    },
});
function select(store)
{
    return {
        team_list: store.userStore.team_list,
        operateNotify: store.userStore.operateNotify,
    }
}
export default connect(select)(ModifyTeamName);
