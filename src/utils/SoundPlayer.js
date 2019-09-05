import Sound from 'react-native-sound';
import firebase from 'react-native-firebase';
import * as errorTypes from '../constants/ErrorTypes';

const soundMap = {
  you_are_currently: require("../../audio/you_are_currently.wav"),
  in: require("../../audio/in.wav"),
  place: require("../../audio/place.wav"),
  ahead_of: require("../../audio/ahead_of.wav"),
  and: require("../../audio/and.wav"),
  behind: require("../../audio/behind.wav"),
  below: require("../../audio/below.wav"),
  hundred: require("../../audio/hundred.wav"),
  meters: require("../../audio/meters.wav"),
  million: require("../../audio/million.wav"),
  the_next_runner: require("../../audio/the_next_runner.wav"),
  the_previous_runner: require("../../audio/the_previous_runner.wav"),
  thousand: require("../../audio/thousand.wav"),
  yards: require("../../audio/yards.wav"),
  rank_1: require("../../audio/rank_1.wav"),
  rank_2: require("../../audio/rank_2.wav"),
  rank_3: require("../../audio/rank_3.wav"),
  rank_4: require("../../audio/rank_4.wav"),
  rank_5: require("../../audio/rank_5.wav"),
  rank_6: require("../../audio/rank_6.wav"),
  rank_7: require("../../audio/rank_7.wav"),
  rank_8: require("../../audio/rank_8.wav"),
  rank_9: require("../../audio/rank_9.wav"),
  rank_10: require("../../audio/rank_10.wav"),
  rank_11: require("../../audio/rank_11.wav"),
  rank_12: require("../../audio/rank_12.wav"),
  rank_13: require("../../audio/rank_13.wav"),
  rank_14: require("../../audio/rank_14.wav"),
  rank_15: require("../../audio/rank_15.wav"),
  rank_16: require("../../audio/rank_16.wav"),
  rank_17: require("../../audio/rank_17.wav"),
  rank_18: require("../../audio/rank_18.wav"),
  rank_19: require("../../audio/rank_19.wav"),
  rank_20: require("../../audio/rank_20.wav"),
  rank_30: require("../../audio/rank_30.wav"),
  rank_40: require("../../audio/rank_40.wav"),
  rank_50: require("../../audio/rank_50.wav"),
  rank_60: require("../../audio/rank_60.wav"),
  rank_70: require("../../audio/rank_70.wav"),
  rank_80: require("../../audio/rank_80.wav"),
  rank_90: require("../../audio/rank_90.wav"),
  rank_100: require("../../audio/rank_100.wav"),
  num_1: require("../../audio/num_1.wav"),
  num_2: require("../../audio/num_2.wav"),
  num_3: require("../../audio/num_3.wav"),
  num_4: require("../../audio/num_4.wav"),
  num_5: require("../../audio/num_5.wav"),
  num_6: require("../../audio/num_6.wav"),
  num_7: require("../../audio/num_7.wav"),
  num_8: require("../../audio/num_8.wav"),
  num_9: require("../../audio/num_9.wav"),
  num_10: require("../../audio/num_10.wav"),
  num_11: require("../../audio/num_11.wav"),
  num_12: require("../../audio/num_12.wav"),
  num_13: require("../../audio/num_13.wav"),
  num_14: require("../../audio/num_14.wav"),
  num_15: require("../../audio/num_15.wav"),
  num_16: require("../../audio/num_16.wav"),
  num_17: require("../../audio/num_17.wav"),
  num_18: require("../../audio/num_18.wav"),
  num_19: require("../../audio/num_19.wav"),
  num_20: require("../../audio/num_20.wav"),
  num_30: require("../../audio/num_30.wav"),
  num_40: require("../../audio/num_40.wav"),
  num_50: require("../../audio/num_50.wav"),
  num_60: require("../../audio/num_60.wav"),
  num_70: require("../../audio/num_70.wav"),
  num_80: require("../../audio/num_80.wav"),
  num_90: require("../../audio/num_90.wav")
}

export const playSounds = (soundArr) => {
  playSoundsHelper(soundArr, 0);
};

const playSoundsHelper = function(soundArr, index) {
  if(index<soundArr.length) {
    const sound = new Sound(soundMap[soundArr[index]], (error) => {
       if (error) {
        firebase.crashlytics().recordError(errorTypes.SOUND_ERROR, error);
         return;
       }

       sound.play(() => {
         sound.release();
         playSoundsHelper(soundArr, index+1);
       });
    });
  }
};
