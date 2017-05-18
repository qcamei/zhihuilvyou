'use strict';

import * as TYPES from '../actions/types';
import { isEqual } from '../utils/CommonUtil';
const initialState = {
	isLoggedIn: false,
	user: {},//用户信息
	team_list: [],//团队列表
	group_list: {},//团队成员列表
	device_information: {},//设备信息
	LOAD_deposit: {},
	// order_list:[],
	orderListLoad: {},
	order_opereate: {},
	order_detail: {},

	operateNotify: "",//操作返回通知

};

export default function user(state = initialState, action)
{
	switch (action.type)
	{
		case TYPES.LOGGED_IN:
			return {
				...state,
				isLoggedIn: true,
				user: action.user,
			};

		case TYPES.LOGGED_OUT:
			return {
				...state,
				isLoggedIn: false,
				user: {},
			};
		case TYPES.REGISTER_DOWN:
			return {
				...state,
				operateNotify: "registerSuc" + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.USERINFO_LOAD:
			return {
				...state,
				user: {...action.userinfo_data },
			};
		case TYPES.PW_CHANGE:
			return {
				...state,
				operateNotify: "changePwSuc" + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.PW_RESET:
			return {
				...state,
				operateNotify: "resetPwSuc" + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.GUIDE_CERTIFITION:
			return {
				...state,
				operateNotify: "guideCertifition" + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.Team_List:
			return {
				...state,
				team_list: action.team_list,
			};
		case TYPES.group_list://团队成员列表
			var group_list = state.group_list;
			group_list[action.groupid] = action.group_list;
			return {
				...state,
				group_list: {
					...group_list,
				},
			};
		case TYPES.group_add_member://团队成员增加
			action.members = action.members ? action.members : [];
			let obj = {};
			var g_list = state.group_list;
			if (g_list[action.groupid])
			{
				obj[action.groupid] = g_list[action.groupid].concat(action.members);
			}
			else
			{
				obj[action.groupid] = action.members;
			}
			var TeamList = state.team_list;
			for (let i = 0; i < state.team_list.length; i++)
			{
				if (state.team_list[i].id == action.groupid)
				{
					TeamList[i].peoples+=action.members.length;
					break;
				}
			}
			
			return {
				...state,
				team_list:TeamList,
				group_list: {
					...state.group_list,
					...obj,
				},
				operateNotify: 'addmember' + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.group_delete_member://删除团队成员
			var g_list = state.group_list;
			var oldMembers={};
			oldMembers[action.groupid] = g_list[action.groupid];
			if (oldMembers[action.groupid])
			{
				let newMembers = [];
				for (let i = 0; i < oldMembers[action.groupid].length; i++)
				{
					if (oldMembers[action.groupid][i].id == action.id)
					{
						oldMembers[action.groupid].splice(i,1);
						break;
					}
				}
			}
			
			var TeamList = state.team_list;
			for (let i = 0; i < state.team_list.length; i++)
			{
				if (state.team_list[i].id == action.groupid)
				{
					TeamList[i].peoples-=1;
					break;
				}
			}
			
			return {
				...state,
				team_list:TeamList,
				group_list: {
					...state.group_list,
					...oldMembers
				},
				operateNotify: 'delmember' + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.group_modify_member://修改团队成员信息
			var g_list = state.group_list;
			var oldMembers = g_list[action.groupid];
			if (oldMembers)
			{
				for (let i = 0; i < oldMembers.length; i++)
				{
					if (oldMembers[i].id == action.member.id)
					{
						oldMembers[i] = {...oldMembers[i],...action.member };
					}
					else if(action.member.device_num && oldMembers[i].device_num == action.member.device_num)
					{
						oldMembers[i] = {...oldMembers[i],device_num:""};
					}
				}
			}
			return {
				...state,
				group_list: {
					...g_list
				},
				operateNotify: 'modifymember' + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.add_team://增加团队
			return {
				...state,
				operateNotify: "addteam" + Math.round(Math.random() * 1000000).toString(),
				team_list: [action.add_team].concat(state.team_list),
			};
		case TYPES.Delete_Team://删除团队
			let newTeamList = [];
			for (let i = 0; i < state.team_list.length; i++)
			{
				if (state.team_list[i].id != action.id)
				{
					newTeamList.push(state.team_list[i]);
				}
			}
			 
			return {
				...state,
				team_list: newTeamList,
				operateNotify: 'deleteteam' + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.modify_teamname://修改团队名称
			let TeamList = state.team_list;

			for (let i = 0; i < state.team_list.length; i++)
			{
				if (state.team_list[i].id == action.id)
				{
					TeamList[i].name = action.name;
					break;
				}
			}
			 
			return {
				...state,
				team_list: TeamList,
				operateNotify: 'modify_teamname' + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.LOAD_deposit:
			return {
				...state,
				LOAD_deposit: action.LOAD_deposit,
			};
		case TYPES.LOAD_device_information:
			return {
				...state,
				device_information: action.device_information,

			};
		case TYPES.commit_order:
			return {
				...state,
				operateNotify: "orderSuc" + Math.round(Math.random() * 1000000).toString(),
			};
		case TYPES.LOAD_order_list://订单列表
			return {
				...state,
				orderListLoad: action.data,
			};
		case TYPES.LOAD_order_detail://订单详情
			return {
				...state,
				order_detail: action.order_detail,
			};
		case TYPES.handle_order://订单操作
			return {
				...state,
				order_opereate: action.handle_order
			};
		default:
			return state;
	}
}