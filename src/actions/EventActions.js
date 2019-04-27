import firebase from 'react-native-firebase';
import {
  SET_EVENTS,
  UPDATE_EVENT,
  UPDATE_USER
} from './types';

export const loadEvents = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('Events').where("time", ">", new Date()).orderBy("time").limit(20).get()
    .then((response) => {
        let events = {};

        response.forEach((doc) => {
          events[doc.id] = getEvent(doc);
        });

        dispatch({ type: SET_EVENTS, payload: events });
        resolve();
    })
    .catch((error) => {
      reject(error.message);
    });
  });
};

export const registerForEvent = (user, event) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const eventRef = firebase.firestore().collection('Events').doc(event.id);
    const userRef = firebase.firestore().collection('Users').doc(user.id);

    if(!event.registrants) {
      event.registrants = {};
    }

    if(!user.events) {
      user.events = {};
    }

    event.registrants[user.id] = {id: user.id, username: user.username};
    user.events[event.id] = {id: event.id};

    eventRef.update({registrants: event.registrants})
    .then(() => {
      dispatch({ type: UPDATE_EVENT, payload: event, id: event.id });

      userRef.update({events: user.events})
      .then(() => {
        dispatch({ type: UPDATE_USER, payload: user });
      });
    });
  });
};

export const cancelEvent = (user, event) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const eventRef = firebase.firestore().collection('Events').doc(event.id);
    const userRef = firebase.firestore().collection('Users').doc(user.id);

    delete user.events[event.id];
    delete event.registrants[user.id];

    eventRef.update({registrants: event.registrants})
    .then(() => {
      dispatch({ type: UPDATE_EVENT, payload: event, id: event.id });

      userRef.update({events: user.events})
      .then(() => {
        dispatch({ type: UPDATE_USER, payload: user });
        resolve();
      });
    });
  });
};

function getEvent(doc) {
  const id = doc.id;
  const { time, distance, registrants } = doc.data();

  return {
    id,
    time,
    distance,
    registrants
  };
}
