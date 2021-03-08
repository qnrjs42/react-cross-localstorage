### made date: 2021.03.04

```shell
1.0.0 up -> good (완성)
1.0.0 down -> not good (미완성)

now: not good (미완성)
```

Hello!

react에서 localstorage를 편하게 공유하기 위해 패키지를 만들었습니다.

`react-cross-localstorage`는 iframe을 통해 localstorage를 공유합니다.

localstorage 사용방법을 알고 계신다면 정말 간단하게 사용할 수 있으며, 초기 세팅만 해준다면 `react-cross-localstorage`로 대체 가능합니다.

**피드백 적극 환영합니다.**

You wanna english document Or english errorData?

then, eMail send me or create Issue!!!

`qnrjs42@gmail.com`

`https://github.com/qnrjs42/react-cross-localstorage/issues`

You shouldn't have to do, I'll make english document.

But, It could take a long time.

`And Your Feedback is Very Welcome!!!!!!!!!`

---

## 특징

- iframe을 이용하여 localstorage를 공유합니다.
- 공유뿐만 아니라 제거도합니다.
- 타입스크립트를 지원합니다.
- 비동기를 지원합니다.
- 편합니다.

---

## Quick Start

### 0. set guest domains

- 하위 도메인들 경로를 지정해줍니다.
- 3차 도메인이 없는 경우 무조건 키 값을 'main'으로 지정합니다.

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



### 1. host init

- guestDoamins의 iframe을 생성합니다.

```tsx
// src/App.tsx
import crossStorage, { IHostInit } from 'react-cross-localstorage';

import { getDoamins } from './config/config';

componentDidMount() {
  const hostInitData: IHostInit = {
    guestDomains: getDoamins(),
    pathName: '/only-local', // sub domain name
    reactId: 'root' // options (react root id tag)
  }
  crossStorage.hostInit(hostInitData); // here
}
```



### 2. guest init

- host로 부터 데이터를 전달 받을 준비합니다.

```tsx
// src/App.tsx
import crossStorage from 'react-cross-localstorage';

constructor(props: IProps) {
  super(props);

  this.state = {
    initialState: false,
  }
  crossStorage.guestInit(); // here
}
```



### 3. getItem

- localstorage를 가져옵니다.

```ts
import crossStorage from 'react-cross-localstorage';

console.log(crossStorage.getItem('token'));

or

console.log(crossStorage.getItem(['token', 'uuid']));
```



### 4. setItem

- localstorage를 생성합니다.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const localStorageKeys: string[] = ['token', 'uuid'];
const localStorageValues: string[] = ['1234', '2345'];

const setItemResult: IResultMessage = await crossStorage.setItem(localStorageKeys, localStorageValues); // here
console.log(setItemResult);

or

const setItemResult: IResultMessage = await crossStorage.setItem('token', '1234'); // here
console.log(setItemResult);
```



### 5. removeItem

- localstorage를 제거합니다.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const localStorageKeys: string[] = ['token', 'uuid'];

const setItemResult: IResultMessage = await const removeItemResult: IResultMessage = await crossStorage.removeItem(localStorageKeys); // here
console.log(removeItemResult);

or

const setItemResult: IResultMessage = await const removeItemResult: IResultMessage = await crossStorage.removeItem('token'); // here
console.log(removeItemResult);
```



### 6. clear

- localstorage를 모두 제거합니다.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const removeItemResult: IResultMessage = await crossStorage.clear(); // here
console.log(removeItemResult);
```



### 7. close

- host의 iframe을 제거합니다.

```tsx
import crossStorage, { IResultMessage } from 'react-cross-localstorage';

const localStorageKeys: string[] = ['token', 'uuid'];
const localStorageValues: string[] = ['1234', '2345'];

const setItemResult: IResultMessage = await crossStorage.setItem(localStorageKeys, localStorageValues);
console.log(setItemResult);

const closeResult: IResultMessage = crossStorage.close(); // here
console.log(closeResult);
```



### 8. setItemOnce

- hostInit + setItem + close를 한 번에 처리합니다.

```tsx
// src/App.tsx
// crossStorage.hostInit(hostInitData); // here
```

```tsx
const localStorageKeys: string[] = ['token', 'uuid'];
const localStorageValues: string[] = ['1234', '2345'];

// const setItemResult: IResultMessage = await crossStorage.setItem(localStorageKeys, localStorageValues); // here

// const closeResult: IResultMessage = crossStorage.close(); // here

const hostInitData: IHostInit = {
  guestDomains: getDoamins(),
  pathName: '/only-local',
  reactId: 'root' // options (react root id tag)
}

const setItemOnceResult: IResultMessage = await crossStorage.setItemOnce(
  hostInitData, 
  localStorageKeys, 
  localStorageValues
); // here
console.log(setItemOnceResult);
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

### 21.03.08 [0.6.0 v]

- README, guestDomains 3차 도메인 없는 경우 key가 'main' 필수 추가
- README, getItem 배열 예제 추가
- key가 계속 main으로 지정되는 버그 수정
- setItemOnce 기능 추가
- 에러 처리 파일 분리
- 인터페이스 파일 분리
- key 찾는 로직 함수로 분리

