'use strict';

// import { AlertIOS } from 'react-native';

import * as TYPES from './types';


/** 收到聊天消息*/
export function receiveMsg(msg)
{
	return {
		'type': TYPES.Chat_Receive_Msg,
		'msg':msg,
	}
}
/**所在团队信息 */
export function myGroupInfo(info)
{
	return{
		type:TYPES.Cur_Group_Info_Device,
		group:info,
	}
}
export function myGroupInfo_modify(info)
{
	return{
		type:TYPES.modify_group_info,
		group:info
	}
}
/**所在团队信息 */
export function myGroupInfo_Guide(info)
{
	return{
		type:TYPES.Cur_Group_Info_User,
		group:info,
	}
}
/**收到成员位置 */
export function recMemberPos(info)
{
	return{
		type:TYPES.Rec_Member_Pos,
		memberPos:info
	}
}
