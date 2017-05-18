import React from 'react';
import
{
    Image,
    StyleSheet,
    View,
} from 'react-native';

export default class MessageAudio extends React.Component
{
    constructor(props)
    {
      super(props);
      this.state={
        bPlaying:false,
      }
    }

    render()
    {
        return(
        <Image source={this.state.bPlaying?(this.props.position=='left'?require('../imgs/icons/chat_sound_play_left.gif'):require('../imgs/icons/chat_sound_play_right.gif'))
        :(this.props.position=='left'?require('../imgs/icons/chat_sound_left.png'):require('../imgs/icons/chat_sound_right.png'))} 
           style={{width:20,height:20,marginVertical:5,marginLeft:this.props.position=="left"?2:30,marginRight:this.props.position=='left'?30:2}}/>
        );
    }

    togglePlayingAudio(bPlaying)
    {
      if(this.state.bPlaying!=bPlaying)
      {
        this.setState({bPlaying});
      }
    }
}

