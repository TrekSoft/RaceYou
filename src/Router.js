import { createStackNavigator, createAppContainer } from 'react-navigation';
import Loading from './Loading';
import Home from './Home';
import EventDetails from './EventDetails';

const Router = createStackNavigator(
  {
    Loading,
    Home,
    EventDetails
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer(Router);
