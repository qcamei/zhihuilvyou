import React, { PropTypes } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  Platform,
} from 'react-native';
class AMapPolylineView extends React.Component {
    static propTypes = {
      coordinates: PropTypes.array,
     strokeWidth: PropTypes.number,

    /**
     * The stroke color to use for the path.
     */
    strokeColor: PropTypes.string,
     zIndex: PropTypes.number,
     ...View.propTypes,
    };
    render(){
         return <AMapPolyline {...this.props} />;
    }
}
const AMapPolyline = requireNativeComponent('AMapPolyline', AMapPolylineView);

// AMapPolylineView.Animated = Animated.createAnimatedComponent(AMapPolylineView);

export default AMapPolylineView;