import React from 'react';
import
{
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

import { isSameDay, isSameUser, warnDeprecated } from './utils';

export default class Day extends React.Component
{
  render()
  {
    if (!isSameDay(this.props.currentMessage, this.props.previousMessage))
    {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>
              {this.getDateString()}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
  getDateString()
  {
    const createDate = new Date();
    createDate.setTime(this.props.currentMessage.createdAt);
    return ((createDate.getMonth()+1).toString() + "-"
          + (createDate.getDate()<10?"0"+createDate.getDate():createDate.getDate()) + " "
          + (createDate.getHours()<10?"0"+createDate.getHours():createDate.getHours()) + ":"
          + (createDate.getMinutes()<10?"0"+createDate.getMinutes():createDate.getMinutes())) ;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    // backgroundColor: '#ccc',
    // borderRadius: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  text: {
    // backgroundColor: 'transparent',
    color: '#b0b0b0',
    fontSize: 13,
    fontWeight: '600',
  },
});

Day.contextTypes = {
  getLocale: React.PropTypes.func,
};

Day.defaultProps = {
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  //TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameUser: warnDeprecated(isSameUser),
};

Day.propTypes = {
  currentMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  //TODO: remove in next major release
  isSameDay: React.PropTypes.func,
  isSameUser: React.PropTypes.func,
};
