import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as AudioManager from "../utils/AudioManager"
import * as clientModel from "../Net/clientModel"

export default class Send extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
  //     return true;
  //   }
  //   return false;
  // }
  constructor(props)
  {
    super(props);
    this.state={
      bSpeak:false,
      isSending:AudioManager.isSending,
      isListening:AudioManager.isListening,
    };
    AudioManager.setStopSendingCb(this.onStopSending.bind(this));
    AudioManager.setstopListeningCb(this.onStopListening.bind(this));
    this.mounted=true;
  }
  componentWillUnmount()
  {
    this.mounted=false;
  }
  toggleSpeak(bSpeak)
  {
    if(this.mounted && bSpeak!=this.state.bSpeak)
      this.setState({bSpeak});
  }
  onStopSending(data)
  {
    if(this.mounted && this.state.isSending)
      this.setState({isSending:false});
  }
  onStopListening(data)
  {
    if(this.mounted && this.state.isListening)
      this.setState({isListening:false});
  }
  render() {
    if (this.props.text.trim().length > 0 && !this.state.bSpeak) {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      );
    }
    return(
      <TouchableOpacity
          style={styles.container}
          onPress={()=>this.onActionsPress()}
          >
          <View style={{backgroundColor:'#b2b2b2',borderRadius:15}}>
            <Image source={this.props.user._id==-1?(this.state.isSending?require('../imgs/icons/chat_guide_open.png'):require('../imgs/icons/chat_guide_close.png'))
                :(this.state.isListening?require('../imgs/icons/chat_tourist_open.png'):require('../imgs/icons/chat_tourist_close.png'))  }
              style={{width:30,height:30}}/>
          </View>
          
            
        </TouchableOpacity>
    )
  }
  onActionsPress()
  {
    if(this.props.user && this.props.user._id != 0)
    {
      if(this.props.user._id==-1)
      {
        if(this.state.isSending)
        {
          AudioManager.stopSending();
        }
        else{
          AudioManager.startSending();
          this.setState({isSending:true});
        }
      }
      else
      {
        if(this.state.isListening)
        {
          AudioManager.stopListen(this.props.user._id);
          this.setState({isListening:false});
        }
        else{
          // AudioManager.startListen();
          // clientModel.toggle_listen(1);
          AudioManager.startListen(this.props.user._id);
          this.setState({isListening:true});
        }
      }
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 50,
    alignItems:'center',
    justifyContent:'center',
  },
  text: {
    color: '#FFFFFF',
    backgroundColor:"#0084ff",
    borderRadius:5,
    // fontWeight: '600',
    fontSize: 14,
    paddingVertical:5,
    paddingHorizontal:10
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: '发送',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  label: React.PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
