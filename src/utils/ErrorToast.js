import { Toast } from 'native-base';

export const showErrorToast = (error) => {
  Toast.show({
    text: error,
    buttonText: 'Okay',
    style: {
      backgroundColor: '#d32f2f'
    },
    duration: 5000
  });
};
