import React, { Component, PropTypes } from 'react';
import * as clientModel from '../Net/clientModel';
import { connect } from 'react-redux';
import
{
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';
import { wndWidth, wndHeight, headBarPt } from '../Global';

export default class ReRoute extends Component
{


    constructor(props)
    {
        let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        super(props);
        this.state = {
            name: "",
            ds: ds,
            datas: [],
            bShow: false,
            length: 0
        }
    }
    render()
    {

        let renderList = this.renderList.bind(this);
        if (!this.state.bShow)
        {
            return null;
        }
        else return (

            <View style={styles.dialogStyle}>
                <View style={styles.button}>
                    <Text style={styles.textPrompt}>{this.state.name}</Text>
                    <Text style={styles.textRight}>({this.state.length}条推荐路线)</Text>
                </View>
                {renderList()}
            </View>
        );
    }
    renderItem(rawData)
    {
        let clickMenuItem = this.clickMenuItem.bind(this);
        return (
            <TouchableOpacity onPress={() => { clickMenuItem(rawData.id - 1) } }>
                <View style={styles.button}>
                    <View style={styles.image}>
                        <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{rawData.id}</Text>
                    </View >
                    <Text style={styles.textButton}>{rawData.rt_name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderList()
    {
        return (
            <View style={styles.bottom}>
                <ListView
                    initialListSize={1}
                    showsHorizontalScrollIndicator={false}
                    enableEmptySections={true}
                    dataSource={this.state.ds}
                    renderRow={this.renderItem.bind(this)}
                    >
                </ListView>
            </View>
        )
    }
    clickMenuItem(id)
    {
        let arrPos = [];
        let ids = this.state.datas[id].id;
        if (this.state.datas[id].routes)
        {
            for (let i = 0; i < this.state.datas[id].routes.length; i++)
            {
                arrPos.push({

                    latitude: this.state.datas[id].routes[i][1],
                    longitude: this.state.datas[id].routes[i][0],
                })
            }
        }

        this.setState({ "bShow": false });
        if (this.props.onPressItem != null && typeof (this.props.onPressItem) == "function")
        {

            this.props.onPressItem(arrPos, ids);
        }
    }
    toggleRe(bShow, list, length, name, datas)
    {

        this.setState({ bShow, ds: this.state.ds.cloneWithRows(list), length: length, name: name, datas: datas });


    }
}
const styles = StyleSheet.create({
    dialogStyle: {
        position: 'absolute',
        left: 0,
        top: 40 + headBarPt,
        width: wndWidth,
        height: wndHeight * 0.4,
        paddingBottom: 15,
        backgroundColor: 'white',
        opacity: 0.8
    },
    image: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#03bcdd",
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        height: 50,
        alignItems: 'center',
        marginLeft: 20,
        flexDirection: 'row',
        marginRight: 20,
        borderBottomWidth: 0.8,
        borderColor: '#d5d5d5',
    },
    bottom: {
        flex: 1,
        flexDirection: 'column',
    },

    textPrompt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    textButton: {
        fontSize: 15,
        color: 'black'
    },
    textRight: {
        fontSize: 14,
        color: 'black',
        marginLeft: 10,
    }
});

