'use strict';

// import { AlertIOS } from 'react-native';

import * as TYPES from './types';


// login
export function logIn(id, error)
{
	var userData = {};
	userData.id = id;
	userData.error = error;
	return {
		'type': TYPES.LOGGED_IN,
		'user': userData
	}
}

// logout
export function logOut()
{
	return {
		'type': TYPES.LOGGED_OUT
	}
}

/**加载保证金*/
export function LOAD_deposit(data)
{
	return {
		'type': TYPES.LOAD_deposit,
		'LOAD_deposit': data
	}
}
/**加载设备租赁信息*/
export function LOAD_device_information(data)
{
	return {
		'type': TYPES.LOAD_device_information,
		'device_information': data
	}
}

/**加载订单详情*/
export function load_order_detail(data)
{
	return {
		'type': TYPES.LOAD_order_detail,
		'order_detail': data
	}
}

/**操作订单*/
export function handle_order(data)
{
	return {
		'type': TYPES.handle_order,
		'handle_order': data
	}
}

/**加载订单列表*/
export function load_order_list(data, page_num, total_record, state_type)
{
	// data.total_record,data.state
	return {
		'type': TYPES.LOAD_order_list,
		data: {
			order_list: data,
			total_record,
			state_type,
			page_num
		}

	}
}


/**加载设备租赁信息*/
export function commit_order(data)
{
	return {
		'type': TYPES.commit_order,
		'order_data': data
	}
}

/**加载个人信息*/
export function userinfo_load(data)
{

	return {
		'type': TYPES.USERINFO_LOAD,
		'userinfo_data': data
	}
}
/**修改密码*/
export function pw_change()
{
	return {
		'type': TYPES.PW_CHANGE,
	}
}
/**找回密码*/
export function pw_reset(data)
{
	return {
		'type': TYPES.PW_RESET,
	}
}
/**导游认证*/
export function guide_certifition(data)
{
	return {
		'type': TYPES.GUIDE_CERTIFITION,
		'user': data
	}
}
/**团队列表*/
export function team_list(team_list)
{
	return {
		'type': TYPES.Team_List,
		'team_list': team_list
	}
}
/** 团队成员*/
export function group_list(groupid, group_list)
{
	return {
		type: TYPES.group_list,
		groupid: groupid,
		group_list: group_list
	}
}
/** 增加团队成员*/
export function group_add_member(groupid, members)
{
	return {
		'type': TYPES.group_add_member,
		groupid,
		members
	}
}
/** 删除团队成员*/
export function group_delete_member(groupid, id)
{
	return {
		'type': TYPES.group_delete_member,
		groupid,
		id
	}
}
/**修改团队成员信息 */
export function group_modify_member(groupid, member)
{
	return {
		'type': TYPES.group_modify_member,
		groupid,
		member
	}
}
/**新增团队*/
export function add_team(add_team)
{
	return {
		'type': TYPES.add_team,
		'add_team': add_team
	}
}
/**修改团队名称 */
export function modify_teamname(id, name)
{
	return {
		'type': TYPES.modify_teamname,
		'id': id,
		name
	}
}
/**删除团队 */
export function delete_team(id)
{
	return {
		'type': TYPES.Delete_Team,
		'id': id
	}
}
/**注册*/
export function register()
{
	return {
		'type': TYPES.REGISTER_DOWN,
		'user': 0
	}
}
export function userinfo_update(data)
{
	var userinfo_updateData = data;
	return {
		'type': TYPES.USERINGO_UPDARE,
		'userinfo_updateData': userinfo_updateData
	}
}

//异步example
export function asyncExample()
{
	return (dispatch) =>
	{
		dispatch({ 'type': TYPES.LOGGED_DOING });
		let inner_get = fetch('http://www.baidu.com')
			.then((res) =>
			{
				dispatch({
					'type': TYPES.LOGGED_IN, user: {
						'name': 'juju',
						'age': '24',
						'avatar': 'https://avatars1.githubusercontent.com/u/1439939?v=3&s=460'
					}
				});
			}).catch((e) =>
			{
				alert(e.message);
				dispatch({ 'type': TYPES.LOGGED_ERROR, error: e });
			});
	}
}