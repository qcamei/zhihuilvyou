import React from 'react';
import
{
  // Vibration,
  Platform,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  View,
  PanResponder,
} from 'react-native';
import * as AudioManager from '../utils/AudioManager';
import {httpServerAdd} from '../config';
import {toastShort} from '../utils/ToastUtil';
import {BtnStatus} from '../Global';
import {isEqual} from '../utils/CommonUtil'
var FileUpload = require('NativeModules').FileUpload;



export default class Composer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      bSpeak: false,
      btnStatus: BtnStatus.Up,
    };
    this._panResponder = {};
  }
  render()
  {
    if (!this.state.bSpeak)
      return (
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          onChange={(e) =>
          {
            this.props.onChange(e);
          } }
          style={[styles.textInput, this.props.textInputStyle, {
            height: this.props.composerHeight,
          }]}
          value={this.props.text}
          accessibilityLabel={this.props.text || this.props.placeholder}
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
          {...this.props.textInputProps}
          />
      );

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 50, backgroundColor: '#ffffff' }}>
        <TouchableHighlight
          ref={(ref) => { this.touchable = ref } }
          style={{ paddingVertical: 5, width: 180, borderColor: '#888888', borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
          onPressIn={() => this.onPressIn()}
          onPressOut={() => this.onPressOut()}
          onPress={() => this.onPress()}
          underlayColor="#00ffff"
          activeOpacity={1}
          pressRetentionOffset={{ top: 70, left: 200, right: 200, bottom: 20 }}
          >
          <Text style={{ fontSize: 16 }}>{this.getBtnText()}</Text>
        </TouchableHighlight >
      </View>

    );
  }
  changeBtnStatus(btnStatus)
  {
    //同一帧时多次setState，更新失败....放到下一帧更新
    this.btnStatus = btnStatus;
    if(this.timer2) return;
    this.timer2 = setTimeout(()=>{
      if(this.props.toggleSpeakTip)
      {
        this.props.toggleSpeakTip(this.btnStatus);
      }
      if(this.btnStatus!=this.state.btnStatus)
      {
        this.setState({btnStatus:this.btnStatus});
        //先用着----源码事件处理在 node_modules/react-native/Libraries/Components/Touchable/Touchable.js  404行中
        if (this.btnStatus)
        {
          this.bTouchReleaseSetted = true;
          this.touchable.touchableHandleResponderRelease = (e) =>
          {
            this.touchable._receiveSignal("RESPONDER_RELEASE", e);
            this.changeBtnStatus(BtnStatus.Up);
            AudioManager.stopRecording();
          };
          this.touchable.touchableHandleResponderTerminate = (e) =>
          {
            this.touchable._receiveSignal("RESPONDER_TERMINATED", e);
            this.changeBtnStatus(BtnStatus.Up);
            AudioManager.stopRecording();
          }
        }
      }
      clearTimeout(this.timer2);
      this.timer2=null;
    },1);
    
  }
  onPressIn()
  {
    this.changeBtnStatus(BtnStatus.PressedAndDown);

    if(AudioManager.getRecordingStatus()!=0) return;
    /**按住50ms延迟 */
    this.timer = setTimeout(()=> {
      /**松开了 */
      if(this.state.btnStatus==BtnStatus.Up)
      {
        clearTimeout(this.timer);
        return;
      }
      this.startRecordingTime = Date.now();
      AudioManager.startRecording();
      // Vibration.vibrate();
    }, 50);
  }
  onPressOut()
  {
    this.changeBtnStatus(BtnStatus.PressedAndUp);
  }
  onPress()
  {
    this.changeBtnStatus(BtnStatus.Up);
    /**少于500ms时长，不发送 */
    if(Date.now()-this.startRecordingTime > 500)
    {
       this.shouldSendRecord=true;
    }
    if(!this.haha)
    {
      this.haha=true;
      AudioManager.stopRecording();
    }
    
  }
  
  componentDidMount()
  {
    AudioManager.setRecordFinishCb(this.onRecordingFinish.bind(this));
  }
  componentWillUnmount()
  {
    AudioManager.stopRecording();
  }
  onRecordingFinish(path)
  {
    if(this.shouldSendRecord)
    {
      this.uploadAudio(path);
    }
    this.shouldSendRecord=false;
  }
  uploadAudio(path)
  {
    let filename = path.split("/")[path.split("/").length - 1];
    var obj = {
      uploadUrl: httpServerAdd + "upload/chatAudio",
      method: 'POST', // default 'POST',support 'POST' and 'PUT'
      headers: {
        'Accept': 'application/json',
      },
      fields: {
        'localPath': path
      },
      files: [
        {
          // name: this.props.user.userid, // optional, if none then `filename` is used instead
          filename: filename, // require, file name
          filepath: path, // require, file absoluete path
          // filetype: 'images', // options, if none, will get mimetype from `filepath` extension
        },
      ]
    };
    FileUpload.upload(obj, (err, result)=>{
      if (err)
      {
        toastShort("网络出错")
      }
      else
      {
        try
        {
          let data = JSON.parse(result.data);
          if (data && data.status == 0)
          {
            if(this.props.onSend)
            {
                this.props.onSend({audio:data.path,localPath:data.localPath},false);
            }
          }
          else
          {
            toastShort("发送失败");
          }
        }
        catch (e)
        {
          toastShort("发送失败");
        }
      }
    })
  }

  getBtnText()
  {
    switch (this.state.btnStatus)
    {
      case BtnStatus.Up:
        return "按住说话";
      case BtnStatus.PressedAndDown:
        return '松开结束';
      case BtnStatus.PressedAndUp:
        return '松开取消发送'
    }
  }
  toggleSpeak(bSpeak)
  {
    if (bSpeak != this.state.bSpeak)
      this.setState({ bSpeak });
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    borderColor: "#0000ff",
    borderBottomWidth: 1,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
});

Composer.defaultProps = {
  onChange: () => { },
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
  text: '',
  placeholder: '',
  // placeholder: 'Type a message...',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
};

Composer.propTypes = {
  onChange: React.PropTypes.func,
  composerHeight: React.PropTypes.number,
  text: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  placeholderTextColor: React.PropTypes.string,
  textInputProps: React.PropTypes.object,
  multiline: React.PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
