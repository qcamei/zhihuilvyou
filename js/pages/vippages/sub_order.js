/**
 * Created by os on 16/12/27.
 */
import React,{Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Linking,
    InteractionManager,
    ScrollView,
    Dimensions,

} from 'react-native'
import {wndWidth} from "../../Global";
import HeadBar from '../../components/HeadBar'
import QRCode from 'react-native-qrcode'
import rightIcon from '../../imgs/icons/rightNextIcon@2x.png'
import * as clientModel from '../../Net/clientModel'
import { connect } from 'react-redux';
import {infoLoaded} from "../../Global";
import {isEqual} from '../../utils/CommonUtil';
import {formatTime} from '../../utils/FormatUtil';
const {width: deviceWidth,height: deviceHeight} = Dimensions.get('window');
const code_height = deviceWidth/1.5;
class sub_order extends Component{
    // 构造
      constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            expiration_date:'',
            expiration_time:'',
            order_state:2,
            tel_num:'',
            order_date:'',
            finish_date:'',
            recv_Date:'',
            rent_begin:'',
            rent_end:'',
            get_date:'', //保存的领取时间
            rent_time:'', //保存取到的时间戳作对比用
        };
      }

    componentDidMount()  {
        clientModel.load_order_detail(this.props.id);
    }

    componentWillReceiveProps(nextProps) {


        if (nextProps.order_detail){
            // InteractionManager.runAfterInteractions(() => {
                this.setState({
                    order_date:formatTime(nextProps.order_detail.order_date),
                    finish_date:formatTime(nextProps.order_detail.finish_date),
                    recv_Date:formatTime(nextProps.order_detail.recv_date),
                    rent_begin:formatTime(nextProps.order_detail.rent_begin),
                    rent_end:formatTime(nextProps.order_detail.rent_end),
                    get_date:formatTime(nextProps.order_detail.rent_begin-(60000*30)),
                    rent_time:nextProps.order_detail.rent_begin
                });
            // })
        }
        if(!isEqual(nextProps.order_opereate,this.props.order_opereate) && nextProps.order_opereate && nextProps.order_opereate.operator == 1)//取消订单
        {
            this.props.navigator.pop();
        }

    }
    
    shouldComponentUpdate(nextProps,nextState)
    {
        if(isEqual(nextState,this.state))
        {
            return false;
        }
        return true;
    }

    render(){
        return(
            <View>
                <HeadBar
                    title={this.props.order_detail.state == 1?"待领取":(this.props.order_detail.state == 2?"已领取":(this.props.order_detail.state==4?"已完成":"已失效"))}
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator = {this.props.navigator}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        
                    <View style={{marginTop: 13,backgroundColor:'#ffffff',height:code_height,alignItems:'center',justifyContent:'center'}}>
                        <QRCode
                            value={this.props.id.toString()}
                            size={code_height-40}
                            bgColor='#000000'
                            fgColor='white'/>
                        <Text style={{color:'red',fontSize:18}}>{(this.state.rent_time>(new Date()).valueOf()) && this.props.order_detail.state == 1?
                        '有效领取时间:'+this.state.get_date+"--"+this.state.rent_begin.substring(11):'有效领取时间:已过期'}</Text>
                    </View>
                        <View style={{backgroundColor:'#ffffff',height:60*5,marginTop:13,flexDirection:'column',alignItems:'center'}}>
                            {this._renderMenuItem('订单编号',this.props.id.toString())}
                            {this._renderMenuItem('预约数量',this.props.order_detail.quality +'台')}
                            {this._renderMenuItem('预约时间',this.state.rent_begin+'~'+this.state.rent_end.substring(11))}
                            {this._renderMenuItem('订单金额',this.props.order_detail.fee + '元')}
                            {this._renderMenuItem('支付方式',this.props.order_detail.payment == 1?'线下支付':'其他支付')}
                            </View>
                        {this.props.order_detail.state==1?this._orderType(2):(this.props.order_detail.state==2?this._orderType(3):(this.props.order_detail.state==3 || this.props.order_detail.state==-1?this._orderType(2):this._orderType(4)))}

                        {this.props.order_detail.state==1?this._pressBtn():null}

                    </View>
                </ScrollView>
            </View>
        )
    }
    _renderMenuItem(leftTitle, rightTitle)
    {
        return (
            <View style={styles.View1}>
                <Text style={styles.TextLeft}>{leftTitle}</Text>
                <Text style={styles.TextRight}>{rightTitle}</Text>
            </View>
        );
    }

    _pressBtn(){
        return(
            <TouchableOpacity style= {styles.loginButton} onPress={this._onDelegate.bind(this)}>
                <Text style={{textAlign:'center',fontSize:20,color:'#ffffff',fontFamily:'PingFang-SC-medium'}}> 取消订单 </Text>
            </TouchableOpacity>
        )
    }
    _onDelegate(){

        clientModel.handle_order(this.props.id,1)
    }

    //状态 1-待领取 2-已领取 3-失效 4-完成
    _orderType(index){
        if (this.props.order_detail.state == 1 ){
            return <View style={{backgroundColor:'#ffffff',height:60*index,marginTop:13,flexDirection:'column',alignItems:'center'}}>
                {this._renderMenuItem('订单时间',this.state.order_date)}
                {this._renderBtn()}
            </View>

        }else if (this.props.order_detail.state == 2){
            return <View style={{backgroundColor:'#ffffff',height:60*index,marginTop:13,flexDirection:'column',alignItems:'center'}}>
                {this._renderMenuItem('订单时间',this.state.order_date)}
                {this._renderMenuItem('领取时间',this.state.recv_Date)}
                {this._renderBtn()}
            </View>
        }else if (this.props.order_detail.state == 4){
            return <View style={{backgroundColor:'#ffffff',height:60*index,marginTop:13,flexDirection:'column',alignItems:'center'}}>
                {this._renderMenuItem('订单时间',this.state.order_date)}
                {this._renderMenuItem('领取时间',this.state.recv_Date)}
                {this._renderMenuItem('完结时间',this.state.finish_date)}
                {this._renderBtn()}
            </View>
        }else if (this.props.order_detail.state == 3 || this.props.order_detail.state == -1){
            return <View style={{backgroundColor:'#ffffff',height:60*index,marginTop:13,flexDirection:'column',alignItems:'center'}}>
                {this._renderMenuItem('订单时间',this.state.order_date)}
                {this._renderBtn()}
            </View>
        }

    }
    _renderBtn(){
    return(
        <TouchableOpacity style={styles.View1} onPress={this._onPressTel.bind(this)}>
            <Text style={styles.TextLeft}>客服电话</Text>
            <Text style={[styles.TextRight,{right:30}]}>{this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""}</Text>
            <Image style={{position:'absolute',right:11,top:20,width:10,height: 18}}
                   source={rightIcon}
            />
        </TouchableOpacity>
    )
    }
    _onPressTel(){
        Linking.openURL("tel:"+(this.props.sa_info&&this.props.sa_info.telephone?this.props.sa_info.telephone:""));
    }

}

const styles = {
    container:{
        backgroundColor:'#f3f4f6',
        position:'relative',
        flex:1,
    },
    View1:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        backgroundColor:'#ffffff',
        alignItems:'center',
        flex:1,
        borderBottomColor:'#d5d5d5',
        width:wndWidth-30
},
    loginButton:{
        width:wndWidth-40,
        height:50,
        backgroundColor:'#02b3d3',
        borderRadius:10,
        alignSelf:'center',
        justifyContent:'center',
        overflow:'hidden',
        //marginTop:10,
        margin:20
    },
    TextLeft:{
        marginLeft:11,
        fontSize:16,
        color:'#363636'
    },
    TextRight:{
        fontSize:16,
        color:'#707070',
        position:'absolute',
        right:11,
        top:18
    }

};


function select(store)
{
    return {
        order_detail:store.userStore.order_detail,
        order_opereate:store.userStore.order_opereate,
        sa_info: store.scenicStore.sa_info,
    }
}

export default connect(select)(sub_order);