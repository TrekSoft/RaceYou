import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as styles from './styles';
import * as actions from './actions';

class Race extends Component {
  static navigationOptions = {
      title: 'Live Race'
  }

  state = {

  }

  componentWillMount() {
    this.event = this.props.events[this.props.navigation.getParam('eventId')];
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalTop]}>
          <Text>HELLO WORLD</Text>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    events: state.events.list
  };
};

export default connect(mapStateToProps, actions)(Race);
