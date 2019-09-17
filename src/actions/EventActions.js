import firebase from 'react-native-firebase';
import moment from 'moment';
import {
  SET_EVENTS,
  UPDATE_EVENT,
  UPDATE_USER
} from './types';

export const loadEvents = () => dispatch => {
  return new Promise((resolve, reject) => {
    firebase
      .firestore()
      .collection('Events')
      .where(
        'time',
        '>',
        moment(new Date())
          .subtract(2, 'hours')
          .toDate()
      )
      .orderBy('time')
      .limit(20)
      .get()
      .then(response => {
        let events = {};

        response.forEach(doc => {
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
  firebase.analytics().logEvent('event_registration', { distance: event.distance, time: event.time, user: user.id, event: event.id });

  return new Promise((resolve, reject) => {
    const eventRef = firebase.firestore().collection('Events').doc(event.id);
    const userRef = firebase.firestore().collection('Users').doc(user.id);

    if(!event.registrants) {
      event.registrants = {};
    }

    if(!user.events) {
      user.events = {};
    }

    const userRegistration = {id: user.id, username: user.username, gender: user.gender, birthday: user.birthday, distance: 0.0};
    const eventRegistration = {id: event.id, distance: event.distance, time: event.time};

    event.registrants[user.id] = userRegistration;
    user.events[event.id] = eventRegistration;

    eventRef.update('registrants.' + user.id, userRegistration)
    .then((data) => {
      dispatch({ type: UPDATE_EVENT, payload: event, id: event.id });

      userRef.update('events.' + event.id, eventRegistration)
      .then(() => {
        dispatch({ type: UPDATE_USER, payload: user });
      });
    });
  });
};

export const cancelEvent = (user, event) => (dispatch) => {
  firebase.analytics().logEvent('event_cancelation', { distance: event.distance, time: event.time, user: user.id, event: event.id });

  return new Promise((resolve, reject) => {
    const eventRef = firebase.firestore().collection('Events').doc(event.id);
    const userRef = firebase.firestore().collection('Users').doc(user.id);

    delete user.events[event.id];
    delete event.registrants[user.id];

    eventRef.update('registrants.' + user.id, firebase.firestore.FieldValue.delete())
    .then(() => {
      dispatch({ type: UPDATE_EVENT, payload: event, id: event.id });

      userRef.update('events.' + event.id, firebase.firestore.FieldValue.delete())
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
    time: new Date(time.seconds * 1000),
    distance,
    registrants
  };
}
