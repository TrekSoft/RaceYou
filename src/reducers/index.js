import { combineReducers } from 'redux';
import EventsReducer from './EventsReducer';
import UserReducer from './UserReducer';

export default combineReducers({
  events: EventsReducer,
  user: UserReducer
});
