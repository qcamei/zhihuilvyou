/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { PropTypes } from 'react';
import
{
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform
} from 'react-native';
import { headBarPt } from '../Global';


export default class HeadBar extends React.Component
{
  static propTypes = {
    leftText: PropTypes.string,
    leftIcon: PropTypes.any,
    leftClick: PropTypes.func,
    rightText: PropTypes.string,
    rightIcon: PropTypes.any,
    rightClick: PropTypes.func,
    bgColor: PropTypes.any,
    leftIconStyle: PropTypes.any,
    rightIconStyle: PropTypes.any,
    headStyle: PropTypes.any,
    headHeight: PropTypes.number,
    centerIcon: PropTypes.any,
    centerClick: PropTypes.any,
    centerIconStyle: PropTypes.any,

    ...View.propTypes,
  };
  static defaultProps = {
    bgColor: `rgba(2, 179, 211, 1)`,
    centerIconStyle: { width: 12, height: 10 },
    rightIconStyle: { marginRight: 5, width: 9, height: 16 },
    leftIconStyle: { marginLeft: 5, width: 9, height: 16 },
    headHeight: 40,
  };
  constructor(props)
  {
    super(props);
    this.state = {
      bgColor: props.bgColor,
      centerClicked: false,
    }

  }
  render()
  {
    let renderLeft = this.renderLeft.bind(this);
    let renderRight = this.renderRight.bind(this);
    let renderCenter = this.renderCenter.bind(this);
    // <StatusBar backgroundColor= {this.props.bgColor?this.state.bgColor:defaultColor} hidden={false} translucent={true} />
    return (
      <View style={this.props.headStyle}>

        <View style={{
          paddingTop: headBarPt,
          height: this.props.headHeight + headBarPt,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: this.state.bgColor
        }}>
          {renderLeft()}
          {renderCenter()}
          {renderRight()}
        </View>
      </View>
    );
  }
  renderLeft()
  {
    let iconClick = this.onIconClicked.bind(this);
    return (
      <TouchableOpacity style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', width: 80 }} onPress={() => iconClick('left')}>
        {this.props.leftIcon ? <Image source={this.props.leftIcon} style={this.props.leftIconStyle} /> : null}
        <Text style={{ marginLeft: 5, fontSize: 17, color: '#ffffff' }}>{this.props.leftText}</Text>
      </TouchableOpacity>

    )
  }
  renderCenter()
  {
    let iconClick = this.onIconClicked.bind(this);
    return (
      <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onPress={() => iconClick('center')}>
        <Text style={{ fontSize: 18, color: '#ffffff' }}>{this.props.title}</Text>
        {this.props.centerIcon ? <Image
          source={this.state.centerClicked ? (this.props.centerIconClick ? this.props.centerIconClick : this.props.centerIcon) : this.props.centerIcon}
          style={this.props.centerIconStyle} />
          : null}
      </TouchableOpacity>
    )
  }
  renderRight()
  {
    let iconClick = this.onIconClicked.bind(this);
    return (
      <TouchableOpacity style={{ marginLeft: 10, flexDirection: 'row-reverse', alignItems: 'center', width: 80 }} onPress={() => iconClick('right')}>
        {this.props.rightIcon ? <Image source={this.props.rightIcon} style={this.props.rightIconStyle} /> : null}
        <Text style={{ marginRight: 5, fontSize: 17, color: '#ffffff' }}>{this.props.rightText}</Text>
      </TouchableOpacity>
    )
  }
  setBgColor(color)
  {
    this.setState({ "bgColor": color });
  }
  onIconClicked(type)
  {
    if (type == "left" && this.props.leftClick)
    {
      this.props.leftClick();
    }
    else if (type == "right" && this.props.rightClick)
    {
      this.props.rightClick();
    }
    else if (type == 'center')
    {
      if (this.props.centerClick)
      {
        this.props.centerClick(!this.state.centerClicked);
      }
      if (this.props.centerIconClick && this.props.centerIcon)
      {
        this.setState({ "centerClicked": !this.state.centerClicked });
      }

    }
    else if (this.props.navigator)
    {
      this.props.navigator.pop();
    }
  }

}