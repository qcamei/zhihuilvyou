import React, { Component } from 'react';
import
{
    StyleSheet,
    ListView,
    View,
    Image,
    TouchableOpacity,
    InteractionManager,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import HeadBar from '../components/HeadBar';
import webviewPage from './WebViewPage';
import { wndWidth } from '../Global';
class Scenic extends Component
{
    constructor(props)
    {
        super(props);
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.state = {
            dataSource: ds
        }
    }
    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() =>
        {
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.props.sp_article_list) })
        })
    }
    render()
    {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <HeadBar
                    title='景区景点'
                    leftIcon={require('../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={this.props.navigator}
                    />
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <ListView
                        renderFooter={()=> {return <View style={{height:10}}></View>}}
                        initialListSize={5}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={false}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)} />
                </View>

            </View>

        )
    }
    renderRow(rowData)
    {
        return (
            <TouchableOpacity onPress={() => this.openWebview(rowData.pointid, rowData.name, 1)}>
                <View style={{ width: wndWidth - 20, height: 150, marginTop: 10 }}>
                    <Image source={{ uri: rowData.image }} style={{ flex: 1 }} />
                    <Text style={{position:'absolute',right:10,bottom:5,color:'#FFFFFF',backgroundColor:'transparent',fontSize:17}}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    openWebview(spid, title, cate_id)
    {
         
        this.props.navigator.push({ component: webviewPage, name: "WebViewPage", params: { spid, title, cate_id } })
    }
}

function select(store)
{
    return {
       
        sp_article_list: store.scenicStore.sp_article_list,
    }
}
export default connect(select)(Scenic)