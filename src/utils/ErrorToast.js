import { Toast } from 'native-base';

export const showErrorToast = (error) => {
  Toast.show({
    text: error,
    buttonText: 'Okay',
    style: {
      backgroundColor: '#ffa800'
    },
    duration: 5000
  });
};
