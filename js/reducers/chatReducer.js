'use strict';

import * as TYPES from '../actions/types';

const initialState = {
	msgList:[],//本地缓存消息列表
    lastMsg:{},//收到的最后一条消息
	savedGroupId:0,
	groupInfo:{},
	isOwner:false,
	memberPos:{},
};

export default function chat(state = initialState, action)
{

	switch (action.type)
	{
		case TYPES.Chat_Receive_Msg:
            let msgList = [action.msg].concat(state.msgList);
			return {
				...state,
                msgList:msgList,
				lastMsg:action.msg,
			};
		case TYPES.Cur_Group_Info_Device:
			//通过设备获取的当前团队信息,group_id=0不清空
			if(action.group.group_id!=0)
			{
				// console.warn(action.group.group_id,state.savedGroupId,state.savedGroupId==action.group.group_id )
				if(action.group.group_id==state.savedGroupId)
				{
					return{
						...state,
						isOwner:false,
						groupInfo:action.group,
					}
				}
				else
				{
					//跟当前已保存的聊天数据不同group,清空
					return{
						msgList:[],
						lastMsg:{},
						isOwner:false,
						savedGroupId:action.group.group_id,
						groupInfo:action.group,
					}
				}
			}
			else
			{
				return{
					...state,
					isOwner:false,
					groupInfo:action.group,
				};
			}
		case TYPES.Cur_Group_Info_User:
			//通过用户获取的当前团队信息
			if(action.group && action.group.group_id==state.savedGroupId)
			{
				//跟当前已保存的聊天数据同group
				return{
					...state,
					isOwner:true,
					groupInfo:action.group,
				}
			}
			else
			{
				return{
					...state,
					msgList:[],
					lastMsg:{},
					isOwner:true,
					savedGroupId:action.group.group_id,
					groupInfo:action.group,
				};
			}
		case TYPES.Rec_Member_Pos://收到成员位置
			return{
				...state,
				memberPos:action.memberPos
			};
		case TYPES.modify_group_info:
			return{
				...state,
				groupInfo:{...state.groupInfo,...action.group},
			};
		break;
		default:
			return state;
	}

}