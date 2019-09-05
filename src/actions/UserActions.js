import firebase from 'react-native-firebase';
import {
  SET_USER,
  UPDATE_USER
} from './types';

export const setUser = (user) => (dispatch) => {
  dispatch({ type: SET_USER, payload: user });
};

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

export const setUserInfo = (user, username, gender, birthMonth, birthYear) => (dispatch) => {
  const birthday = new Date(birthYear, birthMonth-1);

  return new Promise((resolve, reject) => {
    const userRef = firebase.firestore().collection('Users').doc(user.id);
    userRef.set({
        username,
        gender,
        birthday
    }, { merge: true })
    .then(() => {
      dispatch({ type: UPDATE_USER, payload: { username, gender, birthday }});
      resolve();
    })
    .catch((error) => {
      reject(error.message);
    });
  });
};
