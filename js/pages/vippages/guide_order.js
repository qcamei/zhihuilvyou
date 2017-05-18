/**
 * Created by os on 16/12/26.
 */
import React from 'react'
import
{
    View,
    Image,
    Text,
    InteractionManager,
    DeviceEventEmitter,
    ActivityIndicator,
    ListView
} from 'react-native'

import HeadBar from '../../components/HeadBar'
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import SrcOrder from './src_order'
import { connect } from 'react-redux';
import * as clientModel from '../../Net/clientModel'
import { infoLoaded } from "../../Global";

export default class guide_order extends React.Component
{
    // 构造
    constructor(props)
    {
        super(props);
        this.curShowIdx = 0;
    }

    _renderTitleIndicator()
    {
        return <PagerTitleIndicator titles={['全部', '待领取', '已领取', '已完结', '已失效']} style={{
            marginTop: -48, backgroundColor: '#ffffff',
            position: 'absolute', top: 0, left: 0, right: 0, height: 48
        }}
            itemTextStyle={{ color: '#a1a1a1', fontSize: 18 }}
            selectedItemTextStyle={{ color: '#02b3d3', fontSize: 18 }}
            selectedBorderStyle={{ backgroundColor: '#02b3d3' }}
            />;
    }
    render()
    {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <HeadBar
                    title='我的订单'
                    leftIcon={require('../../imgs/icons/backIcon@2x.png')}
                    leftText="返回"
                    navigator={this.props.navigator}
                    />
                <IndicatorViewPager indicator={this._renderTitleIndicator()} style={{ flex: 1, marginTop: 48 }} scrollEnabled={false} onPageSelected={(idx) => this.onSelectPage(idx.position)}>

                    <View >
                        <SrcOrder ref={(ref) => this.list0 = ref} navigator={this.props.navigator} orderState={[0]} bShow={true} />
                    </View>

                    <View style={{ backgroundColor: 'cornflowerblue' }}>
                        <SrcOrder ref={(ref) => this.list1 = ref} navigator={this.props.navigator} orderState={[1]} />
                    </View>

                    <View style={{ backgroundColor: '#1AA094' }}>
                        <SrcOrder ref={(ref) => this.list2 = ref} navigator={this.props.navigator} orderState={[2]} />
                    </View>

                    <View style={{ backgroundColor: '#1AA094' }}>
                        <SrcOrder ref={(ref) => this.list3 = ref} navigator={this.props.navigator} orderState={[4]} />
                    </View>

                    <View style={{ backgroundColor: '#1AA094' }}>
                        <SrcOrder ref={(ref) => this.list4 = ref} navigator={this.props.navigator} orderState={[3, -1]} />
                    </View>

                </IndicatorViewPager>
            </View>
        )
    }

    onSelectPage(idx)
    {
        this.curShowIdx = idx;

        if (idx == 0)
        {
            this.list0.getWrappedInstance().indexShow(true);
        }
        else if (idx == 1)
        {
            this.list1.getWrappedInstance().indexShow(true);
        } else if (idx == 2)
        {
            this.list2.getWrappedInstance().indexShow(true);
        } else if (idx == 3)
        {
            this.list3.getWrappedInstance().indexShow(true);
        } else if (idx == 4)
        {
            this.list4.getWrappedInstance().indexShow(true);
        }

    }
}

