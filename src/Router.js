import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import Loading from './Loading';

const Router = createStackNavigator(
  {
    Loading,
    Home
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer(Router);
