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

    console.log(userRef);

    userRef.get()
    .then((response) => {
      console.log(response);

      if (response.exists) {
        const user = {
          id: userId,
          ...response.data()
        }

        dispatch({ type: SET_USER, payload: user });
        console.log('Set existing user: ' + user);
        resolve(user);
      } else {
        const user = { id: userId };

        userRef.set(user)
        .then(() => {
          console.log('Set new user: ' + user);
          dispatch({ type: SET_USER, payload: user });
          resolve(user);
        })
        .catch((error) => {
          console.log('New user error: ' + error);
          reject(error.message);
        });
      }
    })
    .catch((error) => {
      console.log('Check user error: ' + error);
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
      console.log('Update username error: ' + error);
      reject(error.message);
    });
  });
};
