import React, { Component } from 'react';
import
{
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    Platform,
    TextInput,
    PickerIOS,
} from 'react-native';
import Picker from 'react-native-wheel-picker'
import SelectInputIOS from 'react-native-select-input-ios'
import {wndWidth,wndHeight} from '../Global';

let PickerItemIOS = PickerIOS.Item;
let PickerItem = Picker.Item;
export default class SeLanguage extends Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        super(props);
        this.state = {
            selectedItem: 0,
            selectedId: 0,
            itemList: [],
            bShow: false,
            id: [],
            dataArr: [],
            ds2:ds
        }
    }

    render() {
        let select = this.select.bind(this);
        if (!this.state.bShow) {
            return null;
        }

        else return (

            <View style={{ position: 'absolute', left: 2 * wndWidth / 10, top: wndHeight * 0.5 - 140, width: wndWidth * 0.6, height: 280, alignItems: 'center' }}>
                <View style={styles.dialogStyle}>

                    <View style={styles.top}>
                        <Image source={require('../imgs/icons/btn_voice_1.png')} style={styles.image} />
                        <Text style={styles.textPrompt}>语种</Text>

                    </View>
                    {Platform.OS == 'android'?    <Picker style={styles.bottom}
                                                          itemSpace={35}
                                                          selectedValue={this.state.selectedItem}
                                                          itemStyle={{ color: "black", fontSize: 18 }}
                                                          onValueChange={(index) => this.onPikcerSelect(index)}>
                        {this.state.itemList.map((value, i) => (
                            <PickerItem label={value} value={i} key={"money" + value} />
                        ))}
                    </Picker> :
                        <PickerIOS style={styles.bottom}
                                   selectedValue={this.state.selectedItem+1}
                                   itemStyle={{ color: "black", fontSize: 18,height: 180,width: wndWidth * 0.6}}
                                   onValueChange={(index) => this.onPikcerSelect(index)}>
                            {this.state.dataArr.map((obj, i) => (
                                <PickerItemIOS
                                key={ i}
                                value={obj.orderid}
                                label={obj.type_name}
                                />
                                ))}
                        </PickerIOS>
                    }

                    <View style={{ height: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, }} >
                        <TouchableOpacity onPress={() => [this.setState({ bShow: false }), this.select()]}>
                            <View style={{width:0.2*wndWidth+20,height:40,padding:10,backgroundColor: '#e4f5ff',borderRadius:8,justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize:20,color:'#242424'}}>确定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >

        );

    }


    onPikcerSelect(index) {
        if (Platform.OS == 'android'){
            this.setState({
                selectedItem: index,
                selectedId: this.state.id[index],

            })
        }else {
            this.setState({
                selectedItem: index-1,
                selectedId: this.state.id[index-1],

            })
        }

    }

    select() {
        if (this.props.select != null && typeof (this.props.select) == "function") {

            this.props.select(this.state.selectedId, this.state.selectedItem);
        }
    }

    toggleLan(bShow, list) {
        let ds = [];
        let id = [];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                ds.push(
                    list[i].type_name
                );
                id.push(
                    list[i].id
                )
            }
        }
        this.setState({bShow, itemList: ds, id: id, dataArr: list,ds2:this.state.ds2.cloneWithRows(list)});

    }

}
const styles = StyleSheet.create({
    dialogStyle: {

        flex: 1,
        width: wndWidth * 0.6,
        backgroundColor: 'white',
        borderRadius: 8
    },
    top: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        backgroundColor: '#e4f5ff',
        opacity: 0.8
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 15
    },
    content: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        borderColor: '#9ed9e2',
    },
    bottom: {
        marginRight: 30,
        marginLeft: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {

        width: 30,
        height: 30,

    },
    textPrompt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#242424'
    },

});