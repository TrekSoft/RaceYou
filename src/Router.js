import { createStackNavigator, createAppContainer } from 'react-navigation';
import Loading from './Loading';
import Home from './Home';
import EventDetails from './EventDetails';
import EventResults from './EventResults';
import Race from './Race';

const Router = createStackNavigator(
  {
    Loading,
    Home,
    EventDetails,
    EventResults,
    Race
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer(Router);
