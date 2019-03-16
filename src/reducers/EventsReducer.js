import {
  SET_AVAILABLE_EVENTS,
  SET_USER_EVENTS
} from '../actions/types';

const INITIAL_STATE = {
  availableEvents: {},
  userEvents: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AVAILABLE_EVENTS:
      return { ...state, availableEvents: action.payload };
    case SET_USER_EVENTS:
      return { ...state, userEvents: action.payload };
    default:
      return state;
  }
};
