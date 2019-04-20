import firebase from 'react-native-firebase';
import {
  SET_EVENTS,
  UPDATE_EVENT,
  UPDATE_USER
} from './types';

export const loadEvents = (userEventIds) => (dispatch) => {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('Events').orderBy("time").limit(20).get()
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
      event.registrants = [];
    }

    if(!user.events) {
      user.events = [];
    }

    event.registrants.push(user.id);
    user.events.push(event.id);

    eventRef.update({registrants: event.registrants})
    .then(() => {
      dispatch({ type: UPDATE_EVENT, payload: event, id: event.id });
    });

    userRef.update({events: user.events})
    .then(() => {
      dispatch({ type: UPDATE_USER, payload: user })
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
