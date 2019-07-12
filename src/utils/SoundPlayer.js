import Sound from 'react-native-sound';

const soundMap = {
  you_are_currently: require("../../audio/you_are_currently.wav"),
  in: require("../../audio/in.wav"),
  rank_1: require("../../audio/rank_1.wav"),
  place: require("../../audio/place.wav"),
}

export const playSounds = (soundArr) => {
  playSoundsHelper(soundArr, 0);
};

const playSoundsHelper = function(soundArr, index) {
  if(index<soundArr.length) {
    const sound = new Sound(soundMap[soundArr[index]], (error) => {
       if (error) {
         console.log(error);
         return;
       }

       sound.play(() => {
         sound.release();
         playSoundsHelper(soundArr, index+1);
       });
    });
  }
};
