import React, { Component } from 'react';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import crossStorage, { IHostInit } from 'react-cross-localstorage';

import About from './components/about';
import OnlyLocal from './components/only-local';
import { getDoamins } from './config/config';

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
      crossStorage.guestInit();
      return;
    }
  }

  componentDidMount() {
    if (window.location.pathname === '/only-local') {
      return;
    }

    const hostInitData: IHostInit = {
      guestDomains: getDoamins(),
      pathName: '/only-local',
    }
    crossStorage.hostInit(hostInitData);
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
