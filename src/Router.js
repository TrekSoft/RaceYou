import { createStackNavigator, createAppContainer } from 'react-navigation';
import Loading from './Loading';
import Home from './Home';
import EventDetails from './EventDetails';
import Race from './Race';

const Router = createStackNavigator(
  {
    Loading,
    Home,
    EventDetails,
    Race
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer(Router);
