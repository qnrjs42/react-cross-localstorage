import React, { Component } from 'react';
import crossStorage, { ISetItems, IResultMessage } from 'react-cross-localstorage';

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

  onClickGetItem = () => {
    const item: string | null = crossStorage.getItem('tokenKey');
    console.log(item);

    const items: string[] | null = crossStorage.getItems(['tokenKey', 'uuidKey']);
    console.log(items); 
  };

  onClickSetItem = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const setItemsData: ISetItems = {
      tokenKey: 'tokenValue',
      uuidKey: 'uuidValue',
    }

    // crossStorage.setItems(setItemsData)
    // .then((setItemResult: IResultMessage) => {
    //   console.log(setItemResult);
    // });

    const setItemsResult: IResultMessage = await crossStorage.setItems(setItemsData);
    console.log(setItemsResult);

    // const setItemResult: IResultMessage = await crossStorage.setItem('tokenKey', 'tokenValue');
    // console.log(setItemResult);
    
    // crossStorage.close();

    this.setState({
      isLoading: false,
      isDone: true,
    });
    console.log('전송 완료!');
  };

  onClickRemove = async () => {
    this.setState({
      isLoading: true,
      isDone: false,
    });
    const localStorageKeys: string[] = ['tokenKey'];

    // crossStorage.removeItem(localStorageKeys)
    // .then((removeResult) => {
    //   console.log(removeResult);
    // });

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

    // crossStorage.clear()
    // .then((clearResult: IResultMessage) => {
    //   console.log(clearResult);
    // });

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
          <button onClick={this.onClickGetItem}>localstorage get!</button>
        </div>
        {this.state.isDone && (
          <div>완료</div>
        )}
      </div>
    );
  }
}

export default About;
