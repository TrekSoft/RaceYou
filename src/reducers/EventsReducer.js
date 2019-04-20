import {
  SET_EVENTS,
  UPDATE_EVENT
} from '../actions/types';

const INITIAL_STATE = {
  list: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return { ...state, list: action.payload };
    case UPDATE_EVENT:
      return { ...state, list: { ...state.list, [action.id]: {...action.payload}}}
    default:
      return state;
  }
};
