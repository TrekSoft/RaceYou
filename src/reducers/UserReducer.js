import { SET_USER, UPDATE_USER } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case UPDATE_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
