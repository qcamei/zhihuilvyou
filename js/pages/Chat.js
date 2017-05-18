import React from 'react';
import
{
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from '../chat/GiftedChat';
import HeadBar from '../components/HeadBar';
import * as AudioManager from '../utils/AudioManager';
import { httpServerAdd } from '../config';
import { sendChatMsg } from '../Net/clientModel';
import { isEqual } from '../utils/CommonUtil';
import TeamCenter from '../group/TeamCenter'

const MsgType={
  text:0,
  audio:1,
};
class Chat extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {

    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);

  }

  onSend(message)
  {
    let msg={};
    if(message.text)
    {
      msg.type=MsgType.text;
      msg.content=message.text;
    }
    else if(message.audio)
    {
      msg.type = MsgType.audio;
      msg.content = message.audio;
    }
    if(msg=="")
    {
      return;
    }
    sendChatMsg(msg);
}

onReceive(message)
{
  if (this.giftedChat)
  {
    this.giftedChat.addMsgs(message);
  }
}
onBubblePress(context, bubble)
{
  if (context.audio)
  {
    if (this.playingBubble)
    {
      // this.playingBubble.togglePlayingAudio(false);
      // this.playingBubble=null;
    }
    if (context.localPath)
    {
      AudioManager.playLocal(context.localPath, AudioManager.AudioType.Chat);
    }
    else
    {
      AudioManager.playWithUrl(httpServerAdd + decodeURI(context.audio), AudioManager.AudioType.Chat);
    }
    AudioManager.setFinishCb(this.onVoiceFinished.bind(this));
    AudioManager.setStartCb(this.onVoiceStart.bind(this));
    this.playingBubble = bubble;
  }
}
onVoiceFinished(data)
{
  if (this.playingBubble)
  {
    this.playingBubble.togglePlayingAudio(false);
    this.playingBubble = null;
  }
}
onVoiceStart(data)
{
  if (this.playingBubble)
  {
    this.playingBubble.togglePlayingAudio(true);
  }
}
/**属性变化 */
componentWillReceiveProps(nextProps)
{
  if (nextProps.lastMsg && !isEqual(this.props.lastMsg,nextProps.lastMsg))
  {
    this.onReceive(nextProps.lastMsg);
  }
  if (nextProps.groupInfo && nextProps.groupInfo.group_id==0 && this.props.navigator)
  {
    let routeList = this.props.navigator.getCurrentRoutes();
    if(routeList[routeList.length-1].name=="Chat")
    {
      this.props.navigator.pop();
    }
  }
}
shouldComponentUpdate(nextProps, nextState)
{
  if (isEqual(nextState, this.state) && isEqual(nextProps.groupInfo,this.props.groupInfo))
  {
    return false;
  }
  return true;
}

render()
{
  return (
    <View style={{ flex: 1,backgroundColor:"#ffffff" }}>
      <HeadBar
        title={this.props.groupInfo.group_name}
        leftIcon={require('../imgs/icons/backIcon@2x.png')}
        leftText="返回"
        rightIcon={this.props.isOwner?require('../imgs/icons/team_icon.png'):null}
        rightIconStyle={{ width: 20, height: 20 }}
        rightClick={this.rightclick.bind(this)}
        navigator={this.props.navigator}
        />
      <GiftedChat
        ref={(ref) => this.giftedChat = ref}
        msgs={this.props.msgList}
        onSend={this.onSend}
        onBubblePress={this.onBubblePress.bind(this)}
        user={{
          _id: this.props.groupInfo.member_id,//群主ID以-1表示
        }}
        />
    </View>

  );
}
rightclick(){
  if(this.props.isOwner)
  {
      const { navigator } = this.props;
      navigator.push({
        component: TeamCenter,
        name: 'TeamCenter',
        params: { groupid: this.props.groupInfo.group_id ,curGroupID:this.props.groupInfo.group_id}
      });
  }
}
}
function select(store)
{
  return {
    msgList: store.chatStore.msgList,//本地缓存消息列表
    lastMsg: store.chatStore.lastMsg,//收到的最后一条消息
    groupInfo:store.chatStore.groupInfo,//当前团队信息
    isOwner:store.chatStore.isOwner,
  }
}
export default connect(select)(Chat);
const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
