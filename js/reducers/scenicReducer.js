'use strict';

import * as TYPES from '../actions/types';

const initialState = {
	sa_info: {},//景区基础信息
	sp_article_list: [],//景点文章列表（必玩景点...）
	sp_position_list:[],//景点位置列表
	article_info:{},//文章
	sa_activity_list:[],//活动列表
	sp_voice_info:{},
	sp_recommend_route:{}//推荐路线
};

export default function scenic(state = initialState, action)
{

	switch (action.type)
	{
		case TYPES.SA_List_Load:
			return {
				...state,
				sa_info:action.sa_info,
			};
		case TYPES.SP_Article_List_Load:
			return{
				...state,
				sp_article_list:action.sp_article_list,
			};
		case TYPES.SP_Position_List_Load:
			return{
				...state,
				sp_position_list:action.sp_position_list,
			};
		case TYPES.SP_article_Info:
			return{
				...state,
				article_info:action.articleInfo,
			};
		case TYPES.SA_Activity_list:
			return{
				...state,
				sa_activity_list:action.sa_activity_list,
			};
		case TYPES.SP_voice_load:
			return{
				...state,
				sp_voice_info:action.voiceinfo,
			};
		case TYPES.SP_recommend_route:
		    return{
				...state,
				sp_recommend_route:action.sp_recommend_route,
			};
		case TYPES.sp_lang_list:
		    return{
				...state,
				sp_lang_list:action.sp_lang_list,
			};
		default:
			return state;
	}

}