import React, { Component } from 'react';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

import About from './components/about';
import { getDoamins } from './config/config';
import OnlyLocal from './components/only-local';

const sleep = (count: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, count * 1000);
  })
};

interface IProps {}
interface IState {
  initialState: boolean;
}

class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      initialState: false,
    }

    if (window.location.pathname === '/only-local') {
      return;
    }
  }

  async componentDidMount() {
    const initResult: IResultMessage = crossStorage.init({
      guestDomains: getDoamins(),
    });
    if (initResult.status === 'GUEST') {
      return;
    }

    console.log('iframe 생성 완료');
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            {/* <Link to="/only-local">OnlyLocal</Link> */}
          </li>
        </ul>

        <Switch>
          <Route exact path="/" />
          <Route exact path="/about" component={About} />
          <Route exact path="/only-local" component={OnlyLocal} />
        </Switch>
      </div>
    );
  }
}

export default App;
