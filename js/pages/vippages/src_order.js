/**
 * Created by os on 16/12/26.
 */
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableOpacity,
    Image,
    InteractionManager,
    ActivityIndicator,
    DeviceEventEmitter
}from 'react-native'

import { SwipeListView } from 'react-native-swipe-list-view';
import {PullView,PullList} from 'react-native-pull';
import no_Pay from '../../imgs/icons/no_pay.png'
import moneyIcon from'../../imgs/icons/moneyIcon.png'
import sub_order from './sub_order'
import * as clientModel from '../../Net/clientModel'
import {infoLoaded} from "../../Global";
import {toastShort} from '../../utils/ToastUtil';
import { connect } from 'react-redux';
import { isEqual } from '../../utils/CommonUtil';

class src_order extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if(this.props.bShow)
        {
            this.requestData(true);
        }
        // 初始状态
        this.state = {
            ds: ds,
            bShow:this.props.bShow,
        };
        this.arrData=[];
        this.page_num=1;
        this.total_record=0;
        this.resumeFun=null;
        this.isRequestData=false;
        this.bFirstLoadMore=true;
    }


    onPullRelease(resolve) {
        //do something 更新
        this.requestData(true);
        this.resumeFun = resolve;
    }

    renderFooter() {
        if (this.state.nomore) {
            return null;
        }
        return (
            <View style={{height: 40}}>
                <ActivityIndicator />
            </View>
        );
    }


    loadMore() {
        if(this.bFirstLoadMore)
        {
            this.bFirstLoadMore = false;
            return;
        }
        if(this.arrData && this.arrData.length > 0)
        {
            this.requestData();
        }
    }

    render() {
        
        return this.state.bShow?(
            <PullView onPullRelease={this.onPullRelease.bind(this)} style={{flex:1,backgroundColor:"#ffffff"}}>
                <SwipeListView
                    dataSource={this.state.ds}
                    disableRightSwipe={true}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    onEndReached={this.loadMore.bind(this)}
                    //renderFooter={ this.renderFooter.bind(this) }

                    initialListSize={1}
                    pageSize={1}
                    renderRow={ data => (
                <View style={styles.rowFront}>
                    <TouchableOpacity style={{flexDirection:'row',flex:1,backgroundColor: '#ffffff'}} activeOpacity ={0.6} onPress = {this._pressSub.bind(this,data.id)}>
                                <Image style={{height:56,width:56,position:'absolute',top:0,left:0}}
                                    source={no_Pay}
                        />
                    <View style={{flexDirection:'column',flex:1,marginLeft:40}}>
                            <View style={{height:47,flex:1,flexDirection:'row',alignItems:'center'}}>

                                <Text style={{marginLeft:10,color:'#363636',fontSize:14}}>{'胡里山智慧导览手机'}</Text>
                                <Text style={{marginLeft:37,fontSize:14,color:'#68d91b'}}>{data.quality+'台'}</Text>
                                {this._TextStyle(data.state)}
                            </View>
                            <View style={{height:0.5,backgroundColor:'#d5d5d5',marginLeft:-35}}></View>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',height:47}}>
                                <Text style={{marginLeft:10,fontSize:14,color:'#363636'}}>预约时间:</Text>
                                <Text style={{marginLeft:5,fontSize:14,color:'#979797'}}>{data.rent_begin+'~'+data.rent_end.substring(11)}</Text>

                                <Text style={[styles.TextRightTop,{color:'#ec2424'}]}>{'¥ '+data.fee}</Text>
                            </View>
                    </View>
                </TouchableOpacity>
            </View>
        )}
                    renderHiddenRow={ data => (
            <View style={styles.rowBack}>
                <Text>Left</Text>
                    <TouchableOpacity style={{backgroundColor:'#ec3838',alignItems:'center',width:60,height: 94,justifyContent:'center',marginTop:13}}
                                    onPress={this._delegateCell.bind(this,data.id,data.state)}>
                    <Text style={{color:'#ffffff',fontSize:20}}>删 除</Text>
                    </TouchableOpacity>

            </View>
        )}
                    rightOpenValue={-60}

                />
            </PullView>
        ):(<View style={{flex:1,backgroundColor:"#ffffff"}}/>);
    }


    indexShow(bShow) {
        if(bShow && !this.state.bShow)
        {
            this.setState({bShow});
            this.requestData(true);
        }
    }

    requestData(bRefresh)
    {
        if(this.isRequestData)
            return;
        InteractionManager.runAfterInteractions(() => {
            let page=1;
            let pageSize=8;
            if(!bRefresh)
            {
                if(this.page_num * pageSize >= this.total_record)
                {
                    return;
                }
                page = this.page_num+1;
            }
            this.isRequestData = true;
            clientModel.load_order_list(pageSize,page,this.getRequestState());
        });
    }
    getRequestState()
    {
        if(this.props.orderState[0]==0)
        {
            return 0;
        }
        let rtValue=0;
        for(let i=0;i<this.props.orderState.length;i++)
        {
            if(this.props.orderState[i]==-1)
            {
                rtValue = rtValue | (1<<4);
               
            }
            else{
                rtValue = rtValue | (1<<(this.props.orderState[i]-1))
            }
        }
        return rtValue;
    }
    /**属性变化 */
    componentWillReceiveProps(nextProps)
    {
       if(nextProps.orderListLoad)
       {
           this.isRequestData = false;
           if(this.getRequestState()==nextProps.orderListLoad.state_type)
           {
               if(nextProps.orderListLoad.page_num==1)
               {
                   this.arrData=nextProps.orderListLoad.order_list;
                   if(this.resumeFun)
                   {
                       this.resumeFun();
                   }
               }
               else
               {
                   this.arrData=this.arrData.concat(nextProps.orderListLoad.order_list);
               }
               this.page_num = nextProps.orderListLoad.page_num;
               this.total_record = nextProps.orderListLoad.total_record;
               this.setState({ds: this.state.ds.cloneWithRows(this.arrData)});
           }
            
       }
       if(nextProps.order_opereate && !isEqual(nextProps.order_opereate,this.props.order_opereate))
       {
           if(nextProps.order_opereate.operator==2)//删除
			{
				for(let i = 0;i<this.arrData.length;i++)
				{
					if (isEqual(this.arrData[i].id,nextProps.order_opereate.id))
					{
                        this.requestData(true);
                        // this.arrData.splice(i,1);
						break;
					}
				}
			}
            else if(nextProps.order_opereate.operator==1)//取消
			{
				for(let i = 0;i<this.arrData.length;i++)
				{
					if (isEqual(this.arrData[i].id,nextProps.order_opereate.id))
					{
                        this.requestData(true);
                        // this.arrData[i].state = -1;
						break;
					}
				}
			}
            InteractionManager.runAfterInteractions(() => {
                setTimeout(()=> this.setState({ds: this.state.ds.cloneWithRows(this.arrData)}),100);
            });
            

       }
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        // if (isEqual(nextState, this.state))
        // {
        //     return false;
        // }
        return true;
    }

    _delegateCell(id, state) {
        if (state == 1) {
            alert('请先取消订单')
        } else if (state == 2 && state == 4) {
            toastShort('已完成订单不允许删除')
        }
        else {
            clientModel.handle_order(id, 2)
        }

    }

    _pressSub(id) {
        if (id) {
            this.props.navigator.push({
                component: sub_order,
                name: 'sub_order',
                navigator: this.props.navigator,
                params: {id}
            });
        }
    }


    _TextStyle(type) {
        if (type == 3 || type == -1) {
            return <Text style={styles.TextRightTop}>已失效</Text>
        } else if (type == 1) {
            return <Text style={[styles.TextRightTop,{color:'#39c0ff'}]}>待领取</Text>
        } else if (type == 2) {
            return <Text style={[styles.TextRightTop,{color:'#1212e9'}]}>已领取</Text>
        } else if (type == 4) {
            return <Text style={[styles.TextRightTop,{color:'#d91b70'}]}>已完结</Text>
        }
    }

    componentWillUnMount() {
        DeviceEventEmitter.remove();
    }
}

const styles = StyleSheet.create({

    rowFront: {
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        height: 94,
        marginTop: 13
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    TextRightTop: {
        color: '#717171',
        position: 'absolute',
        right: 5,
        top: 14,
        fontSize: 14
    },


});

function select(store)
{
    return {
        orderListLoad: store.userStore.orderListLoad,
        order_opereate: store.userStore.order_opereate,
    }
}
export default connect(select,null,null,{withRef:true})(src_order);