import React, { PropTypes } from 'react';
import ReactNative, {
  Animated,
  View,
  requireNativeComponent,
  NativeModules,
  Platform
} from 'react-native'; 
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
class AMapView extends React.Component {

  static propTypes = {
    logoPosition: PropTypes.oneOf(['center', 'left', 'right']),
    mapType: PropTypes.oneOf(['normal', 'satellite', 'night', 'navi']),
    myLocationEnabled: PropTypes.bool,
    myLocationType: PropTypes.oneOf(['locate', 'follow', 'rotate']),
    myLocationButtonEnabled: PropTypes.bool,
    allGesturesEnabled: PropTypes.bool,
    compassEnabled: PropTypes.bool,
    indoorSwitchEnabled: PropTypes.bool,
    rotateGesturesEnabled: PropTypes.bool,
    scaleControlsEnabled: PropTypes.bool,
    scrollGesturesEnabled: PropTypes.bool,
    trafficEnabled: PropTypes.bool,
    // zoomLevel:PropTypes.number.isRequired,
    tiltGesturesEnabled: PropTypes.bool,
    zoomControlsEnabled: PropTypes.bool,
    zoomGesturesEnabled: PropTypes.bool,

     //image:PropTypes.string,

    //overlay: PropTypes.shape({
    //  latitude: PropTypes.number.isRequired,
    //  longitude: PropTypes.number.isRequired,
    //  latitude1: PropTypes.number,
    //  longitude1: PropTypes.number,
    //  uri: PropTypes.string
    //}),
     //markers: PropTypes.arrayOf(PropTypes.shape({
     //  latitude: PropTypes.number,
     //  longitude: PropTypes.number,
     //  uri:PropTypes.string
     //})),
     //
     //lines: PropTypes.arrayOf(PropTypes.shape({
     //  latitude: PropTypes.number,
     //  longitude: PropTypes.number
     //})),
     //image:PropTypes.any,
    //region: PropTypes.shape({
    //  latitude: PropTypes.number.isRequired,
    //  longitude: PropTypes.number.isRequired,
    //  latitudeDelta: PropTypes.number,
    //  longitudeDelta: PropTypes.number,
    //  zoomLevel: PropTypes.number,
    //}),
    defaultRegion: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
      zoomLevel: PropTypes.number,
    }),
    onRegionChange: PropTypes.func,
    onMove: PropTypes.func,
    onZoom: PropTypes.func,
    onMarkerPress:PropTypes.func,
    // onMapPress:PropTypes.func,
    onMapReady:PropTypes.func,
    onAnimationOver:PropTypes.func,
    startLocation:PropTypes.func,

onUpdateLocation: PropTypes.func,
    ...View.propTypes,
  };

  startLocation(){
    this._runCommand('startLocation',[]);
  }

  //animateToRegion(lat, lng,zoomLevel,ntime) {
  //
  //  this._runCommand('animateToRegion', [lat,lng,zoomLevel,ntime]);
  //}
  
  addMarkers(arrays,type){
    this._runCommand('addMarkers',[arrays,type]);
  }

  addLine(arrays,color){
    this._runCommand('addLine',[arrays,color]);
  }
  clearMarker(type="ex"){
    this._runCommand('clearMarker',[type])
  }
  clearLine(){
    this._runCommand('clearLine',[]);
  }
  addOverlay(map){

    this._runCommand('addOverlay',[map]);
  }
  updateMarkerPos(arr)
  {
    this._runCommand('updatemarkerPos',[arr]);
  }
  animateToCoordinate(latLng, duration) {
    this._runCommand('animateToCoordinate', [latLng, duration || 500]);
  }
 

  _getHandle() {
    return ReactNative.findNodeHandle(this.refs.mapview);
  }

  _runCommand(name, args) {
    if (Platform.OS === 'android') {
      NativeModules.UIManager.dispatchViewManagerCommand(
        this._getHandle(),
        NativeModules.UIManager.RCTAMapView.Commands[name],
        args
      );
    } else if (Platform.OS === 'ios') {
      NativeModules.AMapViewManager[name].apply(
        NativeModules.AMapViewManager[name], [this._getHandle(), ...args]
      );
    }
  }
  _onMapReady(event){
    if (this.props.onMapReady) {
      this.props.onMapReady(event);
    }
  }
  _onRegionChange(event) {
    if (this.props.onRegionChange) {
      this.props.onRegionChange(event);
    }
  }
_onMarkerPress(event){
  if (this.props.onMarkerPress) {
      this.props.onMarkerPress(event);
    }
}
  _onMove(event) {
    if (this.props.onMove) {
      this.props.onMove(event);
    }
  }

  _onZoom(event) {
    if (this.props.onZoom) {
      this.props.onZoom(event);
    }
  }
  _onAnimationOver(e)
  {
    if(this.props.onAnimationOver)
    {
      this.props.onAnimationOver(e);
    }
  }
  _onUpdateLocation(event) {
    if (this.props.onUpdateLocation) {
      this.props.onUpdateLocation(event);
    }
  }

  render() {
  // let image;
  //   if (this.props.image) {
  //     image = resolveAssetSource(this.props.image) || {};
  //     image = image.uri;
  //   }
    return (
      <RCTAMapView ref="mapview"
        {...this.props}
        onRegionChange={e => this._onRegionChange(e)}
        // image={image}
        onMove={e => this._onMove(e)}
        onAnimationOver={e=>this._onAnimationOver(e)}
        onZoom={e => this._onZoom(e)}
        onMapReady={e =>this._onMapReady(e)}
        onMarkerPress={e => this._onMarkerPress(e)}
        onUpdateLocation={e => this._onUpdateLocation(e)} />
    );
  }
}

const RCTAMapView = requireNativeComponent('RCTAMapView', AMapView);
AMapView.Animated = Animated.createAnimatedComponent(AMapView); 
export default AMapView;
