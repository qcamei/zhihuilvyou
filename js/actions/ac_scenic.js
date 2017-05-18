'use strict';

// import { AlertIOS } from 'react-native';

import * as TYPES from './types';


/** 景区列表*/
export function sa_list(sa_info)
{
	return {
		'type': TYPES.SA_List_Load,
		'sa_info': sa_info
	}
}
/**景点文章简介*/
export function sp_article_simple_list(sp_article_list)
{
	return {
		'type': TYPES.SP_Article_List_Load,
		'sp_article_list': sp_article_list
	}
}
/**景区活动列表*/
export function sa_activity_list(act_list)
{
	return {
		'type': TYPES.SA_Activity_list,
		'sa_activity_list': act_list
	}
}

/**景点位置列表 */
export function sp_position_list(sp_position_list)
{
	return {
		'type': TYPES.SP_Position_List_Load,
		'sp_position_list': sp_position_list
	}
}
/**景点位置列表 */
export function SP_article_Info(info)
{
	return {
		'type': TYPES.SP_article_Info,
		'articleInfo': info,
	}
}
/**旅游路线*/
export function sp_recommend_route(sp_recommend_route){
	return{
		'type':TYPES.SP_recommend_route,
		'sp_recommend_route':sp_recommend_route,
	}
}

/**景点语音*/
export function sp_voice_load(data)
{
	return {
		'type':TYPES.SP_voice_load,
		'voiceinfo':data
	}
}

/**景点语音列表*/
export function sp_lang_list(data)
{
	return{
		'type':TYPES.sp_lang_list,
		'sp_lang_list':data
	}
}

