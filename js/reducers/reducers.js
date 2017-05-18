
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import scenicReducer from './scenicReducer';
import chatReducer from './chatReducer';

export default combineReducers({
	userStore: userReducer,
	scenicStore:scenicReducer,
	chatStore:chatReducer,
});
