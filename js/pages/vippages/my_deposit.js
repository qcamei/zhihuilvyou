/**
 * Created by os on 17/1/9.
 */
import React from 'react';
import {
    Text,
    Image,
    View,
    Dimensions,
    StyleSheet,
    ScrollView,
    ListView,
    InteractionManager
} from 'react-native';

import HeadBar from '../../components/HeadBar'
import { connect } from 'react-redux';
import * as clientModel from '../../Net/clientModel'
import {formatTime} from "../../utils/FormatUtil"
import deposit_bg from '../../imgs/icons/deposit_bg.png'
import deposite_mx from '../../imgs/icons/deposit_mx.png'

//ds: this.state.ds.cloneWithRows(Array(5).fill('').map((_, i)=>`item #${i}`)),

class my_deposit extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // 初始状态
        this.state = {
            ds: ds,
            hasData:false,
            deposit_point:'',
            deposit_locked:'',
        };
    }

    componentDidMount() {

        clientModel.load_deposit();
    }

    render() {
        return (
            <View style={{backgroundColor: '#ffffff',flexDirection:'column',flex:1}}>
                <HeadBar
                    title='保证金'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={this.props.navigator}
                />
                <View
                    style={{marginTop:10,backgroundColor: "#1dc5e3",height:100,flexDirection:'column',alignItems:'center'}}>
                    <Text style={styles.deposit_Text}>剩余额度(元)</Text>
                    <Text style={{marginTop: 7,color:'#ffffff',fontSize:20}}>{this.state.deposit_point-this.state.deposit_locked?this.state.deposit_point-this.state.deposit_locked+'元':'0.00元'}</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:-5}}>
                    <Image style={{height:100,width:Dimensions.get('window').width,justifyContent:'center'}}
                           source={deposit_bg}>

                        <View
                            style={{flexDirection:'row',backgroundColor:'#2688ed',height:60,alignSelf:'center',width:Dimensions.get('window').width-80,justifyContent:'space-around'}}>
                            <View style={{flexDirection:'column',alignItems:'center',alignSelf:'center',width:120}}>
                                <Text style={styles.deposit_money2}>{this.state.deposit_point?this.state.deposit_point+".00元":'0.00元'}</Text>
                                <Text style={styles.deposit_Text2}>总保证金(元)</Text>
                            </View>
                            <View style={{backgroundColor:'#ffffff',height: 40,width:1,alignSelf:'center'}}></View>
                            <View style={{flexDirection:'column',alignItems:'center',alignSelf:'center',width:120}}>
                                <Text style={styles.deposit_money2}>{this.state.deposit_locked?this.state.deposit_locked+'.00元':'0.00元'}</Text>
                                <Text style={styles.deposit_Text2}>占用额度(元)</Text>
                            </View>
                        </View>
                    </Image>
                </View>
                <View style={{height:55,backgroundColor:'#f3f4f6',justifyContent:'center'}}>
                    <Text style={{fontSize:18,color:'#979797',marginLeft:15}}>租赁明细</Text>
                </View>

                    {this.props.LOAD_deposit&&this.props.LOAD_deposit.datas&&this.props.LOAD_deposit.datas.length>0?
                        <ListView
                            style={{flex:1}}
                            dataSource={this.state.ds}
                            renderRow={data=>this._renderRow(data)}
                        />:
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:22,color:'#00ff00'}}>您还没有明细记录</Text>
                        </View>
                    }
                    </View>

        )
    }

    _renderRow(data) {
        return (
            <View
                style={{flexDirection:'row',height:70,backgroundColor:'#ffffff',borderBottomColor:'#d5d5d5',borderBottomWidth:1,flex:1}}>
                <View style={{flexDirection:'column',marginLeft:15,justifyContent:'center'}}>
                    <Text style={{fontSize: 18,color:'#484848'}}>{'¥' + data.deposit}</Text>
                    <Text style={{color:'#7b7b7b',fontSize:16,marginTop:5}}>{'设备数额：'+data.quality+'台'}</Text>
                </View>
                <View style={{position: 'absolute',right:15,top:25,flexDirection:"row"}}>
                    <Image style={{height:20,width:20,marginRight:10}} source={deposite_mx}/>
                    <Text style={{fontSize:16}}>{typeof(data.lastdate)=="string"?data.lastdate:formatTime(data.lastdate,true)}</Text>
                </View>
                
            </View>
        )
    }



    componentWillReceiveProps(nextprops) {
        var changeState = {};
        if (nextprops.LOAD_deposit) {
            changeState = {
                ...changeState,
                deposit_point:nextprops.LOAD_deposit.deposit_point,
                deposit_locked:nextprops.LOAD_deposit.deposit_locked,

            };
            if (nextprops.LOAD_deposit.datas.length>0){
                changeState={
                    ...changeState,
                    ds:this.state.ds.cloneWithRows(nextprops.LOAD_deposit.datas),
                }
            }
        }
        if(changeState)
        {
            this.setState(changeState);
        }
    }

}

const styles = StyleSheet.create({
    deposit_Text: {
        marginTop: 20,
        color: '#d1d1d1',
        fontSize: 18
    },
    deposit_Text2: {
        fontSize: 16,
        color: '#c2c2c2'
    },
    deposit_money2: {
        fontSize: 16,
        color: '#ffffff'
    }
});

function select(store) {

    return {
        LOAD_deposit: store.userStore.LOAD_deposit,
    }
}

export default connect(select)(my_deposit);