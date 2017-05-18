
import React from 'react';
import
{
  StyleSheet,
  Navigator,
  StatusBar,
  BackAndroid,
  View
} from 'react-native';
import SceIn from './pages/ScenicIntroduction'
import Splash from './pages/Splash';
// import { naviGoBack } from './utils/CommonUtil';
let tempNavigator;
let isRemoved = false;
export default class Root extends React.Component
{
  static configureScene()
  {
    return Navigator.SceneConfigs.PushFromRight;
  }

  constructor(props)
  {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    // BackAndroid.addEventListener('hardwareBackPress', this.goBack);
  }

  // goBack()
  // {
  //   return naviGoBack(tempNavigator);
  // }

  renderScene(route, navigator)
  {
    // if(route.name=="main")
    // {
    //   BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
    //   isRemoved = true;
    // }
    const Component = route.component;
    tempNavigator = navigator;
    return (
      <Component navigator={navigator}  {...route.params}/>
    );
  }

  render()
  {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'rgba(62, 156, 233, 0)'}
          translucent={true} />
        <Navigator
          style={styles.navigator}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          initialRoute={{
            component: SceIn,
            name: 'SceIn'
          }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});
