import React, { Component } from 'react';

import { getDoamins } from '../../config/config';
import crossStorage, { IHostInit, IResultMessage } from 'react-cross-localstorage';

const sleep = () => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 1500);
  })
};

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

  onClickGetLocalStorage = () => {
    console.log(crossStorage.getItem('token'));
    console.log(crossStorage.getItem(['token', 'uuid']));
  };

  onClickSetItem = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['token', 'uuid'];
    const localStorageValues: string[] = ['1234', '2345'];

    const setItemResult: IResultMessage = await crossStorage.setItem(localStorageKeys, localStorageValues);
    console.log(setItemResult);

    // crossStorage.close();

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('전송 완료!');
  };

  onClickSetItemOnce = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['token', 'uuid'];
    const localStorageValues: string[] = ['1234', '2345'];

    const hostInitData: IHostInit = {
      guestDomains: getDoamins(),
      pathName: '/only-local',
    }

    crossStorage.close();

    await sleep();

    const setItemOnceResult: IResultMessage = await crossStorage.setItemOnce(
      hostInitData, 
      localStorageKeys, 
      localStorageValues
    );
    console.log(setItemOnceResult);

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

    const removeItemResult: IResultMessage = await crossStorage.removeItem(localStorageKeys);
    console.log(removeItemResult);

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('제거 완료!');
  };

  onClickRemoveAll = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const removeItemResult: IResultMessage = await crossStorage.clear();
    console.log(removeItemResult);

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
          <button onClick={this.onClickSetItem}>localstorage share!</button>
          <button onClick={this.onClickRemove}>localstorage remove!</button>
          <button onClick={this.onClickRemoveAll}>localstorage removeAll!</button>
        </div>
        <div>
          <button onClick={this.onClickSetItemOnce}>localstorage share once!</button>
          <button onClick={this.onClickGetLocalStorage}>localstorage get!</button>
        </div>
        {this.state.isDone && (
          <div>완료</div>
        )}
      </div>
    );
  }
}

export default About;
