import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Button, Text, Input, Item } from 'native-base';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { showErrorToast } from './utils/ErrorToast';
import * as styles from './styles';
import * as actions from './actions';

class Loading extends Component {
  static navigationOptions = {
      header: null
  }

  state = {
    isLoading: true,
    isSubmitting: false,
    username: ''
  };

  componentDidMount() {
    firebase.auth().signInAnonymously()
    .then((response) => {
      const user = response.user._user;
      this.props.loadUser(user.uid)
      .then((user) => {
        if(user.username) {
          this.props.navigation.navigate('Home');
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch(() => this.setState({isLoading: false}) );
    })
    .catch(() => showErrorToast('Must have internet connection'));
  }

  onUsernameChange = (username) => {
    this.setState({ username });
  }

  onUsernameSubmit = () => {
    this.setState({isSubmitting: true});

    this.props.setUsername(this.props.user, this.state.username)
    .then(() => this.props.navigation.navigate('Home'));
  }

  renderSubmitButton = () => {
    if (this.state.isSubmitting) {
      return (
        <Button style={styles.buttonDisabled} disabled>
          <Text>Submitting</Text>
        </Button>
      )
    } else {
      return (
        <Button style={styles.button} onPress={this.onUsernameSubmit}>
          <Text>Submit</Text>
        </Button>
      );
    }
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
          {this.renderSubmitButton()}
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={[styles.page, styles.verticalCenter]}>
          <Text style={styles.logo}>RaceYou</Text>
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
