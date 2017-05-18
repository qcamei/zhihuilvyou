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
import React from 'react';
import
{
  StyleSheet,
  WebView,
  View,
  InteractionManager,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import * as clientModel from '../Net/clientModel';
import HeadBar from '../components/HeadBar'
import {httpServerAdd} from "../config";
import {naviGoBack} from '../utils/CommonUtil';
class WebViewPage extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      html: `<!DOCTYPE html>\n<html><body>
        <p id="p1" style="width: 100%;text-align: center;margin-top: 50%">加载中...</p>
        
        <body></html>`
    };
    // <script type="text/javascript">
    //       setInterval(function(){
    //         a = document.getElementById("p1");
    //         a.innerText = a.innerText==加载中...?"加载中..":"加载中...";
    //       },1000)
    //     </script>
  }

  componentDidMount()
  {
    // BackAndroid.addEventListener('hardwareBackPress', naviGoBack.bind(this,this.props.navigator));
    InteractionManager.runAfterInteractions(() =>
    {
        clientModel.article_detail(this.props.spid, this.props.cate_id);
    })
  }
  componentWillUnmount()
  {
    
    // BackAndroid.removeEventListener('hardwareBackPress', naviGoBack);
  }
  componentWillReceiveProps(nextProps)
  {
    if (nextProps.article_info)
    {
      this.setState({"html":`${nextProps.article_info.content}`});
    }

  }
  render()
  {
    const { navigator } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <HeadBar
          title={this.props.title}
          leftIcon={require('../imgs/icons/backIcon@2x.png')}
          leftText="返回"
          navigator={navigator}
          />
        <View style={{ flex: 1 }}>
          <WebView
            ref={(ref) => { this.webview = ref; } }
            automaticallyAdjustContentInsets={false}
            style={{ flex: 1}}
            source={{ html: this.state.html,baseUrl:httpServerAdd}}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            scalesPageToFit
            decelerationRate="normal"
            onShouldStartLoadWithRequest={() =>
            {
              const shouldStartLoad = true;
              return shouldStartLoad;
            } }
            onNavigationStateChange={this.onNavigationStateChange}
            renderLoading={this.renderLoading}
            />
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  }
});

function select(store)
{
  return {
    article_info: store.scenicStore.article_info,
  }
}
export default connect(select)(WebViewPage);
