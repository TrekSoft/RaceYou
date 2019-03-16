import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Button, Text, Input, Item } from 'native-base';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import * as styles from './styles';
import * as actions from './actions';

class Loading extends Component {
  static navigationOptions = {
      header: null
  }

  state = {
    isLoading: true,
    username: ''
  };

  componentDidMount() {
    firebase.auth().signInAnonymously()
    .then((response) => {
      const user = response.user._user;
      this.props.loadUser(user.uid)
      .then((user) => this.props.loadEvents(user.events))
      .catch(() => this.setState({isLoading: false}) );
    });
  }

  onUsernameChange = (username) => {
    this.setState({ username });
  }

  onUsernameSubmit = () => {
    this.props.setUsername(this.props.user, this.state.username);
  }

  renderForm() {
    if (this.state.isLoading) {
      return (<Text style={styles.whiteText}>Loading...</Text>);
    } else {
      return (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Item style={{ maxWidth: 250, borderColor: 'transparent' }}>
            <Input
              style={{backgroundColor: '#fff', paddingLeft: 10, marginBottom: 15, marginTop: 25, borderRadius:5}}
              placeholder='Pick a username'
              value={this.state.username}
              onChangeText={this.onUsernameChange}
            />
          </Item>
          <Button primary style={styles.button} onPress={this.onUsernameSubmit}>
            <Text>Submit</Text>
          </Button>
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalCenter]}>
          <Text style={styles.logo}>Zealor</Text>
          { this.renderForm() }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => (
  {
    user: state.user
  }
);

export default connect(mapStateToProps, actions)(Loading);
