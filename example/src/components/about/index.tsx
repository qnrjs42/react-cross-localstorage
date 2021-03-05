import React, { Component } from 'react';
import { closeIframe, openPostLocalStorageClose, postLocalStorage, IPostLocalStorage, IOpenPostLocalStorageClose } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

interface IProps {}
interface IState {
  isLoading: boolean;
  isDone: boolean;
}

class About extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: false,
      isDone: false,
    }
  }

  onClickCreateLocalStorage = () => {
    localStorage.setItem('token', '1234');
    localStorage.setItem('uuid', '2345');
  }

  onClickPostLocalStorage = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['token', 'uuid'];

    const postData: IPostLocalStorage = {
      localStorageKeys,
      pathname: '/only-local',
      parentDomain: document.domain,
      childDomains: getDoamins(),
      isRemove: false,
    };

    await postLocalStorage(postData);
    closeIframe(document.domain, getDoamins());

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('전송 완료!');
  };

  onClickOpenPostLocalStorageClose = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['token', 'uuid'];

    const postData: IOpenPostLocalStorageClose = {
      reactId: 'root',
      localStorageKeys,
      pathname: '/only-local',
      parentDomain: document.domain,
      childDomains: getDoamins(),
      isRemove: false,
      // isRemoveAll: true,
    };

    await openPostLocalStorageClose(postData);

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('한 번만 전송 완료!');
  };

  onClickRemove = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['token'];

    const postData: IPostLocalStorage = {
      // localStorageKeys,
      pathname: '/only-local',
      parentDomain: document.domain,
      childDomains: getDoamins(),
      // isRemove: true,
      isRemoveAll: true,
    };

    const result = await postLocalStorage(postData);
    
    console.log(result);

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('제거 완료!');
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.onClickCreateLocalStorage}>localstorage create!</button>
          <button onClick={this.onClickPostLocalStorage}>localstorage share!</button>
          <button onClick={this.onClickRemove}>localstorage remove!</button>
        </div>
        <div>
        <button onClick={this.onClickOpenPostLocalStorageClose}>localstorage share once!</button>
        </div>
        {this.state.isDone && (
          <div>완료</div>
        )}
      </div>
    );
  }
}

export default About;
