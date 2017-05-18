import React from 'react';
import
{
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

export default class CustomActions extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      bSpeak:false,
    };
  }
  onActionsPress()
  {
    if(this.props.onClick)
    {
      this.props.onClick(!this.state.bSpeak);
    }
  }
  toggleSpeak(bSpeak)
  {
    if(bSpeak!=this.state.bSpeak)
      this.setState({bSpeak});
  }
  render()
  {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={()=>this.onActionsPress()}
        >
        <Image source={this.state.bSpeak?require('../imgs/icons/chat_txt.png'):require('../imgs/icons/chat_audio.png')}
        style={{width:30,height:30}}/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom:10
  },
});
