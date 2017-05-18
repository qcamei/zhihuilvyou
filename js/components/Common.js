

import React,{Component} from 'react';
import
{
  View,
  Image,
  TouchableOpacity
} from 'react-native';

/**可点击的图片
 * bShow：默认显示 = true   setVisible(bShow)
 * disabled：禁用点击 = false  setDisabled(disabled：禁用点击)
 */
export class ImageButton extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      bShow: this.props.defaultVisible == null ? true : this.props.defaultVisible,
      disabled: this.props.disabled == null ? false : this.props.disabled,
    }
  }
  render()
  {
    return (
      this.state.bShow ? (
        <TouchableOpacity
          style={this.props.containerStyle}
          onPress={()=>{if(this.props.onPress) this.props.onPress()}}
          disabled={this.state.disabled}
          >
          <Image
            style={this.props.imgStyle}
            source={this.props.source}
            />
        </TouchableOpacity>) :
        null
    )
  }
  setVisible(bShow)
  {
    this.setState({ bShow });
  }
  setDisabled(disabled)
  {
    this.setState({ disabled });
  }
}
