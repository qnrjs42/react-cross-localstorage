### made date: 2021.03.04

```shell
1.0.0 up -> completed
1.0.0 down -> not completed

now: not completed
```

Hello!

- react에서 localstorage를 편하게 공유하기 위해 패키지를 만들었습니다.<br/>
  I made package for convenient react cross localstorage share.

- `react-cross-localstorage`는 Iframe을 통해 localstorage를 공유합니다.<br/>
  `react-cross-localstorage` is using Iframe.

- localstorage 사용방법을 알고 계신다면 정말 간단하게 사용할 수 있으며, 초기 세팅만 해준다면 `react-cross-localstorage`로 대체 가능합니다.<br/>

  If you are knowing window.localstorage and then, you'll use very easy.

**피드백 적극 환영합니다.**
**Your Feedback is Very Welcome!!!!!!!!!**

You wanna english document Or english errorData?

and then, Email send me or create Issue!!!

`qnrjs42@gmail.com`

`https://github.com/qnrjs42/react-cross-localstorage/issues`

---

## 특징

- Iframe을 이용하여 localstorage를 공유합니다.<br/>
  It shares Localstorage using Iframe.

- 공유뿐만 아니라 제거도합니다.<br/>
  You can use removeItem(), clear()
- 타입스크립트를 지원합니다.<br/>
  It Supports Typescript.
- 비동기를 지원합니다.<br/>
  It Supports Sync/Async.
- 편합니다.<br/>
  It is So easy and Awesome.

---

## Quick Start

### 1. set guest domains

- 도메인(호스트, 게스트 포함)들의 경로를 지정합니다.<br/>

  **도메인의 경로는 동일한 경로이어야 합니다.**<br/>
  You should set domain(with host, guest).<br/>
  **All domain must be same path.**
- **3차 도메인이 없는 경우 무조건 키 값을 'main'으로 지정합니다.**<br/>
  **If tertiary domain is none and then, you have to put in 'main' key.**

```ts
// configs/config.ts
export const getDoamins = () => {
  return {
    'main': 'http://testlocalstorage.com:3000/only-local',
    'www': 'http://www.testlocalstorage.com:3000/only-local',
    'ko': 'http://ko.testlocalstorage.com:3000/only-local',
    'en': 'http://en.testlocalstorage.com:3000/only-local',
    'cn': 'http://cn.testlocalstorage.com:3000/only-local',
    'jp': 'http://jp.testlocalstorage.com:3000/only-local',
  }
}
```



### 2. init(IInit)

- guestDoamins의 Iframe을 생성하고, 데이터를 전달 받을 준비합니다.<br/>
  Only guestDomains creates Iframe and, get ready for listen data.
- init 설정이 끝나면 `react-cross-localstorage`를 사용할 수 있습니다.<br/>
  When the init setup is complete, `react-cross-localstorage` is available.

```tsx
// src/App.tsx
import crossStorage, { IInit } from 'react-cross-localstorage';

import { getDoamins } from './config/config';

componentDidMount() {
  const initData: IResultMessage = crossStorage.init({
  	guestDomains: getDoamins(),
    reactId: 'root' // options (react DOM root id tag)
	});
  crossStorage.init(initData); // here
}
```



### getItem(string)

- localstorage를 가져옵니다.<br/>
  Get localstorage.

```ts
import crossStorage from 'react-cross-localstorage';

const item: string = crossStorage.getItem('tokenKey');
console.log(item); // tokenValue
```



### getItems(string[])

- localstorage를 가져옵니다.<br/>
  Get localstorage.

```ts
import crossStorage from 'react-cross-localstorage';

const items: string[] = crossStorage.getItems(['tokenKey', 'uuidKey']);
console.log(items); // ['tokenValue', 'uuidValue']
```



### setItem(string, string)

- localstorage를 생성합니다.
  Set localstorage.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const setItemResult: IResultMessage = await crossStorage.setItem('tokenKey', 'tokenValue'); // here
console.log(setItemResult);
```



### setItems(ISetItem)

- localstorage를 생성합니다.<br/>
  Set localstorage.

```ts
import crossStorage, { IResultMessage, ISetItems } from 'react-cross-localstorage';

const setItemsData: ISetItems = {
  tokenKey: 'tokenValue',
  uuidKey: 'uuidValue',
}

const setItemsResult: IResultMessage = await crossStorage.setItems(setItemsData); // here
console.log(setItemsResult)
```



### removeItem(string | string[])

- localstorage를 제거합니다.<br/>
  Remove localstorage.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const localStorageKeys: string[] = ['token', 'uuid'];

// Array
const removeItemResult: IResultMessage = await crossStorage.removeItem(localStorageKeys); // here
console.log(removeItemResult);

or

// String
const removeItemResult: IResultMessage = await crossStorage.removeItem('token'); // here
console.log(removeItemResult);
```



### clear()

- localstorage를 모두 제거합니다.<br/>
  All clear localstorage.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const removeItemResult: IResultMessage = await crossStorage.clear(); // here
console.log(removeItemResult);
```



### close()

- host의 Iframe을 제거합니다. 제거가 된 후 다시 데이터를 전송할 수 없습니다.<br/>

  다시 데이터를 전송하기 위해서는 init()해야 합니다.<br/>
  close host Iframe. you can't send data more.<br/>
  If you wanna send data, you create init() again.

```tsx
import crossStorage, { IResultMessage, ISetItems } from 'react-cross-localstorage';

const setItemsData: ISetItems = {
  tokenKey: 'tokenValue',
  uuidKey: 'uuidValue',
}

const setItemsResult: IResultMessage = await crossStorage.setItems(setItemsData);
console.log(setItemsResult);

const closeResult: IResultMessage = crossStorage.close(); // here
console.log(closeResult);
```



---

## Async Description

### setItem(string, string) Async

```ts
import crossStorage from 'react-cross-localstorage';

crossStorage.setItem('tokenKey', 'tokenValue');
console.log('first');
or

crossStorage.setItem('tokenKey', 'tokenValue')
.then((setItemResult: IResultMessage) => {
  console.log(setItemResult);
});
console.log('first');
```

```shell
# Console
first

or

first
{ status: 'SUCCESS' }
```



### setItems(ISetItems) Async

```ts
import crossStorage, { ISetItems } from 'react-cross-localstorage';

const setItemsData: ISetItems = {
  tokenKey: 'tokenValue',
  uuidKey: 'uuidValue',
}

crossStorage.setItems(setItemsData);
console.log('first');

or

crossStorage.setItems(setItemsData)
.then((setItemResult: IResultMessage) => {
  console.log(setItemResult);
});
console.log('first');
```

```shell
# Console
first

or

first
{ status: 'SUCCESS' }
```



### removeItem(string | string[]) Async

```ts
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

crossStorage.removeItem('token');
console.log('first');

or

crossStorage.removeItem('token')
.then((removeResult: IResultMessage) => {
  console.log(removeResult);
});
console.log('first');
```

```shell
# Console
first

or

first
{ status: 'SUCCESS' }
```



### clear() Async

```ts
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

crossStorage.clear();
console.log('first');

or

crossStorage.clear()
.then((clearResult: IResultMessage) => {
  console.log(clearResult);
});
console.log('first');
```

```shell
# Console
first

or

first
{ status: 'SUCCESS' }
```



---

@@@@@@@@@@@@@@@@@@@@@@@@@

### 피드백 적극 환영!

### Your Feedback is Very Welcome!

`https://github.com/qnrjs42/react-cross-localstorage/issues`

or

`qnrjs42@gmail.com`

@@@@@@@@@@@@@@@@@@@@@@@@@



## Update Note

### 21.03.10 [0.8.1 v]

- README 설명 수정

### 21.03.10 [0.8.0 v]

- hostInit() + guestInit() = init() 으로 로직 변경
- init 시 pathName 제거 (자동화)
- getItem, getItems 분리
- setItem, setItems 분리
- setItemOnce 기능 제거 (hostInit, guestInit 통합 되면서 로직이 꼬여 해당 기능 제거)
- 비동기 설명 추가
- 예제 코드 수정

### 21.03.08 [0.7.0 v]

- close() 시 제대로 iframe이 제거 되지 않는 문제 수정
- setItemOnce() 시 guestDomains가 제대로 할당 되지 않는 문제 수정


### 21.03.08 [0.6.0 v]

- README, guestDomains 3차 도메인 없는 경우 key가 'main' 필수 추가
- README, getItem 배열 예제 추가
- key가 계속 main으로 지정되는 버그 수정
- setItemOnce 기능 추가
- 에러 처리 파일 분리
- 인터페이스 파일 분리
- key 찾는 로직 함수로 분리
- close() 시 제대로 iframe이 제거 되지 않는 문제 수정
- setItemOnce() 시 guestDomains가 제대로 할당 되지 않는 문제 수정
