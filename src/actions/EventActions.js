import firebase from 'react-native-firebase';
import {
  SET_USER_EVENTS,
  SET_AVAILABLE_EVENTS
} from './types';

export const loadEvents = (userEventIds) => (dispatch) => {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('Events').orderBy("time").limit(20).get()
    .then((response) => {
        let availableEvents = {};
        let userEvents = {};

        response.forEach((doc) => {
          const id = doc.id;
          const { time, distance, registrants } = doc.data();
          const date = time.toLocaleDateString("en-US");
          const event = {
            id,
            time,
            distance,
            registrants
          };

          if(userEventIds && userEventIds.includes(id)) {
            if(!userEvents[date]) {
              userEvents[date] = [];
            }

            userEvents[date].push({...event, isRegistered: true});
          } else {
            if(!availableEvents[date]) {
              availableEvents[date] = [];
            }

            availableEvents[date].push({...event, isRegistered: false});
          }
        });

        dispatch({ type: SET_USER_EVENTS, payload: userEvents });
        dispatch({ type: SET_AVAILABLE_EVENTS, payload: availableEvents });
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

    eventRef.update({
        registrants: firebase.firestore.FieldValue.arrayUnion(user.id)
    });

    userRef.update({
        events: firebase.firestore.FieldValue.arrayUnion(event.id)
    });
  });
};
