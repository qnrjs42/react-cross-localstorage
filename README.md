```
1.0.0 up -> good (완성)
1.0.0 down -> not good (미완성)

now: not good (미완성)
```

Hello!

react에서 localstorage를 편하게 공유하기 위해 패키지를 만들었습니다.

**피드백 적극 환영합니다.**

아래 Step은 무조건 읽어보세요!

`아래 Step 진행하면서 어려움이 있으신 분은 언제든지 이슈 남겨주시거나 지메일로 보내주세요!!`

`qnrjs42@gmail.com`

---

### 특징

- iframe을 이용하여 localstorage를 공유합니다.
- 공유뿐만 아니라 제거도합니다.
- 타입스크립트를 지원합니다.
- 비동기를 지원합니다.
- 편합니다.

---

### Function

- addListener() : iframe들이 localstorage를 전달 받기 위한 함수
- openIframe() : iframe 생성하는 함수
- closeIframe(): iframe 제거하는 함수
- postLocalStorage(): iframe들에게 localstorage 공유하는 함수
- openPostLocalStorageClose(): iframe 생성하고, localstorage 공유하고, iframe 제거, addPostMessageListener 제거

- addListener + openIframe + postLocalStorage : 셋이 필수 사항
- addListener + openPostLocalStorageClose : 둘이 필수 사항



---

### Interface

- IOpenIframe
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - reactId?: reactId는 iframe을 생성해주기 위한 최상위 div 태그 `<div id='root'>...</div>`를 가리킵니다.
- ICloseIframe
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
- IPostLocalStorage
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.
- IOpenPostLocalStorageClose
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.
  - reactId?: reactId는 iframe을 생성해주기 위한 최상위 div 태그 `<div id='root'>...</div>`를 가리킵니다.

---

## Step 1. 패키지 다운로드 (Require)

```shell
npm i react-cross-localstorage
```



---

## Step 2. 빈 페이지 생성 (Option)

- 빈 페이지 생성하는 이유는 사이트가 초기 데이터를 로드하는 경우가 많습니다.
  iframe으로 localstorage만 공유할 것이기 때문에 초기 데이터를 굳이 로드할 필요가 없기 때문입니다.
- **(중요)** 꼭 only-local이라고 지정하지 않아도 됩니다.
- 단점으로는 사이트에 빈 페이지가 생기기 때문에 불필요한 라우팅이 될 수 있습니다.

```tsx
// src/components/only-local.tsx
const OnlyLocal = () => null;

export default OnlyLocal;
```



---

## Step 3. 로컬에서 테스트 해보기 (Option)

- 저는 mac 환경에서만 테스트를 진행해서 mac 기준으로 설명 드리겠습니다.

```shell
sudo vim /etc/hosts
```

```
127.0.0.1				localhost
127.0.0.1				testlocalstorage.com
127.0.0.1				www.testlocalstorage.com
127.0.0.1				ko.testlocalstorage.com
127.0.0.1				en.testlocalstorage.com
127.0.0.1				cn.testlocalstorage.com
127.0.0.1				jp.testlocalstorage.com
255.255.255.255	broadcasthost
::1             localhost
```



---

## Step 4. 크로스 도메인별 경로 지정 (Require)

- 크로스 도메인 경로들을 쉽게 탐색하기 위해 저는 함수로 정의했습니다.
- **(중요)** 경로를 지정해줄 때 도메인 주소가 2차 도메인만 있는 경우는 `http://test.localstorage.com` key 값을 꼭 `main`로 지정해줍니다.
  key 값은 HTML id 값이 되기 때문에 id 값이 중복 되지 않도록 합니다.
- **(중요)** 나머지 도메인은 key값과 3차 도메인은 일치해야 합니다.
- 포트는 안 적어도 되지만 로컬환경에서는 적어줘야 합니다.
- 꼭 하위 도메인을 `only-local`로 하지 않아도 됩니다.

```ts
// /src/config/config.ts
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

```
http://www.testlocalstorage.com
1차 도메인: com
2차 도메인: testlocalstorage
3차 도메인: www

http://testlocalstorage.com
1차 도메인: com
2차 도메인: testlocalstorage
3차 도메인: x
```



---

## Step 5. App단에서 초기 데이터 필터링 (Option)

- 사이트에 처음 진입했을 때 `only-local`이라는 페이지가 들어오면 초기 데이터를 로드하지 않고 리턴시킵니다.

```tsx
// src/App.tsx
// import { addListener } from 'react-cross-localstorage';

interface IProps {}
interface IState {
  initialState: boolean;
}
class App extends Component<IState, IProps> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      initialState: false,
    }

    if (window.location.pathname === '/only-local') {
      // addListener();
      return;
    }
  }
  
  componentDidMount() {
    if (window.location.pathname === '/only-local') {
      return;
    }
```



---

## Step 6. addListener() (Require)

- `addListener`는 자식 도메인들이 localstorage 값들을 전달 받을 준비하기 위해 선언합니다.
- 부모 도메인은 `addListener`을 선언하지 않아도 됩니다.

```tsx
// src/App.tsx
import { addListener } from 'react-cross-localstorage';

constructor(props: IProps) {
  super(props);

  this.state = {
    initialState: false,
  }

  if (window.location.pathname === '/only-local') {
    addListener(); // here
    return;
  }
}
```



---

## Step 7. openIframe() (Option)

- openIframe()은 사이트에 들어왔을 때 iframe을 생성하고, localstorage를 공유하고 나서도 계속해서 iframe을 유지시킵니다.
- "아, 나는 한 번만 쓰고 안 쓸 것이다" 하시는 분들을 위해 `openPostLocalStorageClose()`가 준비되어 있으니 걱정하지 않으셔도 됩니다.
  또한 closeIframe() 할 수도 있습니다.



- Interface IOpenIframe
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - reactId?: reactId는 iframe을 생성해주기 위한 최상위 div 태그 `<div id='root'>...</div>`를 가리킵니다.

```tsx
// src/App.tsx
import { IOpenIframe, openIframe, addListener } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

componentDidMount() {
  if (window.location.pathname === '/only-local') {
    return;
  }

  const openIframesData: IOpenIframe = {
    parentDomain: document.domain,
    childDomains: getDoamins(),
    pathname: '/only-local',
    reactId: 'root',
  }
  openIframe(openIframesData); // here
}
```



---

## Step 8. postLocalStorage() (Option)

- `postLocalStorage()`는 각각의 도메인들에게 localstorage를 공유합니다.
- **(중요)** `addListener()`, `openIframe()` 모두 정상 실행 되어야 합니다.



- Interface IPostLocalStorage
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.

```tsx
// src/components/about/index.tsx
import { postLocalStorage, IPostLocalStorage } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

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

  await postLocalStorage(postData); // here
  // closeIframe(document.domain, getDoamins());

  this.setState({
    isLoading: false,
    isDone: true,
  });
  console.log('전송 완료!');
};

render() {
  return (
  	<div>
    	<button onClick={this.onClickPostLocalStorage}>localstorage share!</button>
      
      {this.state.isDone && (
        <div>완료</div>
      )}
    </div>
  )
}
```



---

## Step 9. closeIframe() (Option)

- `closeIframe()`은 더 이상 공유할 localstorage가 없으면 iframe을 제거합니다. 
- **(중요)** `addListener()`, `openIframe()` 모두 정상 실행 되어야 합니다.



- Interface ICloseIframe
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.

```tsx
import { closeIframe, postLocalStorage, IPostLocalStorage } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

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
  closeIframe(document.domain, getDoamins()); // here

  this.setState({
    isLoading: false,
    isDone: true,
  });
  console.log('전송 완료!');
};
```



---

## Step 10. openPostLocalStorageClose() (Option)

- `openPostLocalStorageClose()`는 iframe을 생성하고, localstorage를 공유하고, iframe을 제거합니다.
  로컬스토리지를 한 번만 공유하고 싶을 때 편리합니다.
- **(중요)** `addListener()`이 정상 실행 되어야 합니다.



- Interface IOpenPostLocalStorageClose
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.
  - reactId?: reactId는 iframe을 생성해주기 위한 최상위 div 태그 `<div id='root'>...</div>`를 가리킵니다.

```tsx
import { openPostLocalStorageClose, IOpenPostLocalStorageClose } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

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

render() {
  return (
  	<div>
    	<button onClick={this.onClickOpenPostLocalStorageClose}>localstorage share once!</button>
      
      {this.state.isDone && (
        <div>완료</div>
      )}
    </div>
  )
}
```



---

## Step 11. postLocalStorage() remove (Option)

- `postLocalStorage()` remove는 각각의 도메인들에게 localstorage를 제거합니다.
- **(중요)** `addListener()`, `openIframe()` 모두 정상 실행 되어야 합니다.



- Interface IPostLocalStorage
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.

```tsx
// src/components/about/index.tsx
import { postLocalStorage, IPostLocalStorage } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

onClickRemove = async () => {
  this.setState({
    isLoading: true,
    isDone: false,
  });
  const localStorageKeys: string[] = ['token'];

  const postData: IPostLocalStorage = {
    localStorageKeys,
    pathname: '/only-local',
    parentDomain: document.domain,
    childDomains: getDoamins(),
    isRemove: true, // here
    // isRemoveAll: true,
  };

  await postLocalStorage(postData);

  this.setState({
    isLoading: false,
    isDone: true,
  });
  console.log('제거 완료!');
};

render() {
  return (
  	<div>
    	<button onClick={this.onClickRemove}>localstorage remove!</button>
      
      {this.state.isDone && (
        <div>완료</div>
      )}
    </div>
  )
}
```



---

## Step 12. postLocalStorage() removeAll (Option)

- `postLocalStorage()` removeAll은 각각의 도메인들에게 localstorage를 모두 제거합니다.
- **(중요)** `addListener()`, `openIframe()` 모두 정상 실행 되어야 합니다.



- Interface IPostLocalStorage
  - parentDomain: 현재 보고 있는 도메인 주소를 할당합니다. (document.domain으로 선언해주세요)
  - childDomains: `Step 4`에서 지정해줬던 크로스 도메인 경로들을 할당합니다.
  - pathname: `Step 2`에서 빈 페이지, 하위 도메인을 슬래쉬까지 선언해주어 할당합니다.
  - isRemove? : localstorage 제거합니다.
  - isRemoveAll?: localstorage 모두 제거합니다. (true일 때 localStorageKeys, isRemove 생략 가능)
  - localStorageKeys?: localstorage key를 배열로 받습니다.

```tsx
// src/components/about/index.tsx
import { postLocalStorage, IPostLocalStorage } from 'react-cross-localstorage';

import { getDoamins } from '../../config/config';

onClickRemove = async () => {
  this.setState({
    isLoading: true,
    isDone: false,
  });
  // const localStorageKeys: string[] = ['token'];

  const postData: IPostLocalStorage = {
    // localStorageKeys,
    pathname: '/only-local',
    parentDomain: document.domain,
    childDomains: getDoamins(),
    // isRemove: true,
    isRemoveAll: true, // here
  };

  await postLocalStorage(postData);

  this.setState({
    isLoading: false,
    isDone: true,
  });
  console.log('제거 완료!');
};

render() {
  return (
  	<div>
    	<button onClick={this.onClickRemove}>localstorage remove!</button>
      
      {this.state.isDone && (
        <div>완료</div>
      )}
    </div>
  )
}
```

