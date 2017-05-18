import React from 'react';

import {
  ListView,
  View,
  Text,
} from 'react-native';

import {isEqual} from '../utils/CommonUtil';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
// import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import {BtnStatus,wndWidth,wndHeight} from '../Global';

/**初始加载条数 */
const Show_Count_Initial = 30;
/**收到消息显示条数超过Show_Count_Max，显示条数重置为初始条数 */
const Show_Count_Max = 70;
/**加载更多数据后，收到新消息不检验显示条数超过最大的时间(秒)*/
const No_Check_Time = 60;
/**加载更多显示的条数 */
const Load_Count_earlier = 20;

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1._id != r2._id;
      }
    });
    /**消息KEY*/
    this.msgIdx = 0;
    /**所有的消息列表 */
    this.totalMsgs = props.messages;
    this.resetMsgsContent();
    this.state = {
      dataSource: dataSource.cloneWithRows(this.messagesData.blob, this.messagesData.keys),
      btnStatus:BtnStatus.Up,
    };
  }
  /**重置显示的消息内容 */
  resetMsgsContent()
  {
    /**已加载在显示内容中的消息 */
    let showingMsgs = this.totalMsgs.slice(0,Show_Count_Initial);
    /**更早的消息 */
    this.earlierMsgs=[];
    if(this.totalMsgs.length > Show_Count_Initial)
    {
      this.earlierMsgs = this.totalMsgs.slice(Show_Count_Initial,this.totalMsgs.length);
    }
    this.messagesData = null;
    // showingMsgs.map(m=>m._id=null)
    this.messagesData = this.prepareMessages(showingMsgs);
  }
  prepareMessages(messages,bLoadEarlier=false) {
    return {
      keys: messages.map((m) => {
        this.msgIdx++;
        m._id = this.msgIdx;
        return m._id;
      }),
      blob: messages.reduce((o, m, i) => {
        const previousMessage = messages[i + 1] || (!bLoadEarlier && this.messagesData && this.messagesData.keys && this.messagesData.keys.length>0 && this.messagesData.blob[this.messagesData.keys[0]]) || {};
        const nextMessage = messages[i - 1] || (bLoadEarlier && this.messagesData && this.messagesData.keys && this.messagesData.keys.length>0 && this.messagesData.blob[this.messagesData.keys[this.messagesData.keys.length-1]]) || {};
        
        o[m._id] = {
          ...m,
          previousMessage,
          nextMessage,
        };
        return o;
      }, {})
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (!isEqual(this.props, nextProps)) {
    //   return true;
    // }
    if (!isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    
  }
  /**增加聊天信息 */
  addMsgs(msgs=[])
  {
    if (!Array.isArray(msgs)) {
      msgs = [msgs];
    }
    this.totalMsgs = msgs.concat(this.totalMsgs);

    if(!this.ignoreCheckCountOver && this.totalMsgs.length - this.earlierMsgs.length > Show_Count_Max)
    {
      this.resetMsgsContent();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.messagesData.blob, this.messagesData.keys)
      });
    }
    else
    {
      msgs = this.prepareMessages(msgs);
      if(this.messagesData)
      {
        this.messagesData.blob = {...msgs.blob,...this.messagesData.blob};
        this.messagesData.keys = msgs.keys.concat(this.messagesData.keys);
      }
      else
      {
        this.messagesData=msgs;
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.messagesData.blob, this.messagesData.keys)
      });
    }
  }
  componentWillUnmount()
  {
    if(this.timer)
    {
      clearTimeout(this.timer);
    }
  }
  /**加载更多 */
  onLoadEarlier()
  {
    this.ignoreCheckCountOver = true;
    let msgs = this.earlierMsgs.splice(0,Load_Count_earlier);
    msgs = this.prepareMessages(msgs,true);
    if(this.messagesData)
    {
      this.messagesData.blob = {...msgs.blob,...this.messagesData.blob};
      this.messagesData.keys = this.messagesData.keys.concat(msgs.keys);
    }
     this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.messagesData.blob, this.messagesData.keys)
    });
    if(this.timer)
    {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(()=>{
      this.ignoreCheckCountOver = false;
      this.timer = null;
    },No_Check_Time * 1000)
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.earlierMsgs.length > 0) {
      // const loadEarlierProps = {
      //   ...this.props,
      // };
      // if (this.props.renderLoadEarlier) {
      //   return this.props.renderLoadEarlier(loadEarlierProps);
      // }
      return (
        <LoadEarlier onLoadEarlier={this.onLoadEarlier.bind(this)}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  renderRow(message, sectionId, rowId) {
    if (!message._id && message._id !== 0) {
      return null;
    }
    if (!message.user) {
      return null;
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps}/>;
  }

  renderScrollComponent(props) {
    const invertibleScrollViewProps = this.props.invertibleScrollViewProps;
    return (
      <InvertibleScrollView
        {...props}
        {...invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      />
    );
  }
  renderSpeakTip()
  {
    if(this.state.btnStatus==BtnStatus.Up)
      return null;
    return(
      <View style={{position:'absolute',width:wndWidth,height:wndHeight,top:0,left:0,alignItems:'center',justifyContent:'center'}}>
        <View style={{width:wndWidth/2,height:wndWidth/4,marginTop:50,backgroundColor:`rgba(0,0,0,0.7)`,alignItems:'center',justifyContent:'center',borderRadius:20}}>
          <Text style={{color:"#FFFFFF",textAlign:'center',fontSize:17}}>{this.getTipContent()}</Text>
        </View>
      </View>);
    
  }
  /**开关说话提示 */
  toggleSpeakTip(btnStatus)
  {
    if(btnStatus!=this.state.btnStatus)
      this.setState({btnStatus});
  } 
  getTipContent()
  {
    switch (this.state.btnStatus)
    {
      case BtnStatus.Up:
        return "";
      case BtnStatus.PressedAndDown:
        return '手指上滑，取消发送';
      case BtnStatus.PressedAndUp:
        return '松开手指，取消发送';
    }
  }

  render() {
    return (
      <View ref='container' style={{flex:1}}>
        <ListView
          ref={ref=>this.llll=ref}
          enableEmptySections={true}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={5}
          pageSize={5}

          dataSource={this.state.dataSource}

          renderRow={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier}
          renderScrollComponent={this.renderScrollComponent}
        />
        {this.renderSpeakTip()}
      </View>
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: React.PropTypes.array,
  user: React.PropTypes.object,
  renderFooter: React.PropTypes.func,
  renderMessage: React.PropTypes.func,
  onLoadEarlier: React.PropTypes.func,
};
