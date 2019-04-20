import firebase from 'react-native-firebase';
import {
  SET_USER,
  UPDATE_USER
} from './types';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

export const loadUser = (userId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const userRef = firebase.firestore().collection('Users').doc(userId);

    userRef.get()
    .then((response) => {
      if (response.exists) {
        const user = {
          id: userId,
          ...response.data()
        }

        dispatch({ type: SET_USER, payload: user });
        resolve(user);
      } else {
        const user = { id: userId };

        userRef.set(user)
        .then(() => {
          dispatch({ type: SET_USER, payload: user });
          resolve(user);
        })
        .catch((error) => {
          reject(error.message);
        });
      }
    })
    .catch((error) => {
      reject(error.message);
    });
  });
};

export const setUsername = (user, name) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const userRef = firebase.firestore().collection('Users').doc(user.id);
    userRef.set({
        username: name
    }, { merge: true })
    .then(() => {
      dispatch({ type: UPDATE_USER, payload: { username: name }});
      resolve();
    })
    .catch((error) => {
      reject(error.message);
    });
  });
};
