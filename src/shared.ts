let iframeOnLoadCount = 0;
let postCount = 0;

export const getIframeOnLoadCount = () => {
  return iframeOnLoadCount;
};

export const setIframeOnLoadCount = () => {
  iframeOnLoadCount += 1;
};

export const resetIframeOnLoadCount = () => {
  iframeOnLoadCount = 0;
}

export const getPostCount = () => {
  return postCount;
};

export const setPostCount = () => {
  postCount += 1;
};

export const resetPostCount = () => {
  postCount = 0;
}

export interface IKeyValueString {
  [key: string]: string;
}

interface IBase {
  parentDomain: string;
  childDomains: IKeyValueString;
}

interface IPublic extends IBase {
  pathname: string;
}

export interface IPostLocalStorage extends IPublic {
  isRemove?: boolean;
  isRemoveAll?: boolean;
  localStorageKeys?: string[];
}

export interface IOpenPostLocalStorageClose extends IPostLocalStorage {
  reactId?: string;
}

export interface IOpenIframe extends IPublic {
  reactId?: string;
}

export interface ICloseIframe extends IBase {}

interface IMessageEventData {
  status: 'postToParent' | 'postToChild' | 'removeToChild';
  key: string;
  lastChildKey: string;
  parentDomain: string;
  childDomain: string;
  childDomains: IKeyValueString;
  once? : boolean;
  pathname?: string;
  isRemoveAll?: boolean;
  localStorageInfo?: IKeyValueString;
}
interface INewMessageEvent extends MessageEvent {
  target: Window;
  source: WindowProxy;
  data: IMessageEventData;
}

export interface IIframePostMessage {
  key: string;
  lastChildKey: string;
  parentDomain: string;
  childDomain: string;
  childDomains: IKeyValueString;
  pathname?: string;
  isRemove?: boolean;
  isRemoveAll?: boolean;
  localStorageKeys?: string[];
}

export const filterData = (data: IPostLocalStorage) => {
  const infoObj: any = {};

  infoObj['localStorageKeys'] = data.localStorageKeys ? data.localStorageKeys : null;
  infoObj['parentDomain'] = data.parentDomain ?? '';
  infoObj['childDomains'] = data.childDomains ? data.childDomains : null;
  infoObj['pathname'] = data.pathname ?? '';
  infoObj['isRemove'] = data.isRemove ? data.isRemove : false;
  infoObj['isRemoveAll'] = data.isRemoveAll ? data.isRemoveAll : false;
  
  return infoObj;
};

export const createIframe = (
  iframe: HTMLIFrameElement,
  key: string,
  domain: string,
  reactId: string,
  postMessageObj?: IIframePostMessage,
) => {
  iframe = document.createElement('iframe');
  iframe.setAttribute('id', key);
  iframe.setAttribute('title', key);
  iframe.style.cssText = 'display: none;';
  iframe.src = domain ? domain : '';

  document.getElementById(reactId)?.append(iframe);

  iframe.addEventListener('load', () => {
    if (postMessageObj) {
      iframePostMessage(postMessageObj, true);
    }
    setIframeOnLoadCount();
  }, 
    {once: true}
  );
}

export const iframeLoadingSleep = (iframeCount: number) => {
  return new Promise<void>(resolve => {
    const iframeOnLoadCount: number = getIframeOnLoadCount();
    if (iframeOnLoadCount < iframeCount) {
      setTimeout(async () => {
        resolve(iframeLoadingSleep(iframeCount));
      }, 400);
    } else {
      return resolve();
    }
  });
};

export const postLoadingSleep = (postCount: number) => {
  return new Promise<void>(resolve => {
    const postLoadCount: number = getPostCount();
    if (postLoadCount < postCount) {
      setTimeout(async () => {
        resolve(postLoadingSleep(postCount));
      }, 400);
    } else {
      return resolve();
    }
  });
};

export const removeIframe = async (key: string) => {
  const iframe = document.getElementById(key) as HTMLIFrameElement;
  iframe?.remove();
};

export const addListener = () => {
  window.addEventListener('message', postMessageEventHandler);
};

const removeListener = () => {
  window.removeEventListener('message', postMessageEventHandler);
};

export const iframePostMessage = (data: IIframePostMessage, once?: boolean) => {
  const localStorageInfoObj: IKeyValueString = {};
  data.localStorageKeys && data.localStorageKeys.map((localStorageInfo: string) => {
    localStorageInfoObj[localStorageInfo] = window.localStorage.getItem(localStorageInfo)!;
    return null;
  });

  const postData: IMessageEventData = {
    status: 'postToChild',
    key : data.key,
    lastChildKey: data.lastChildKey,
    parentDomain: data.parentDomain,
    childDomains: data.childDomains,
    childDomain: data.childDomain,
    localStorageInfo: localStorageInfoObj,
  };

  if (once) {
    postData['once'] = true;
  } else {
    postData['once'] = false;
  }

  if (!data.isRemove && !data.isRemoveAll) {
    postData['status'] = 'postToChild';
  } else {
    if (data.isRemoveAll) {
      postData['isRemoveAll'] = true;
    }
    postData['status'] = 'removeToChild';
    postData['pathname'] = data.pathname;
  }

  const iframe = document.getElementById(data.key) as HTMLIFrameElement;

  iframe.contentWindow?.postMessage(postData, data.childDomain);
};

const postMessageEventHandler = (event: MessageEvent) => {
  const customEvent = event as INewMessageEvent;

  // child receive (set localstorage)
  // 1차 보안 위협 제거
  if (
    customEvent.origin.split('/')[2].split(':')[0] === customEvent.data.parentDomain &&
    customEvent.data.status === 'postToChild'
  ) {
    // 2차 보안 위협 제거
    if (customEvent.data.childDomain !== customEvent.target.location.origin) return;

    // localStorage 저장
    for (const [key, value] of Object.entries(customEvent.data.localStorageInfo!)) {
      const realValue: string = value as string;
      localStorage.setItem(key, realValue);
    }
    // 성공 시 부모에게 메시지 전달
    customEvent.source.postMessage(
      {
        status: 'postToParent',
        key: customEvent.data.key,
        lastChildKey: customEvent.data.lastChildKey,
        parentDomain: customEvent.data.parentDomain,
        childDomains: customEvent.data.childDomains,
        once: customEvent.data.once,
      },
      customEvent.origin,
    );
  }

  //child receive (remove localstorage)
  if (customEvent.data.status === 'removeToChild') {
    const domains = customEvent.data.childDomains;
    // 보안 위협 제거
    for (const domain of Object.values(domains)) {
      const splitDomain: string = domain ? domain?.split(customEvent.data.pathname!)[0] : '';
      if (splitDomain === customEvent.origin) {
        if (customEvent.data.isRemoveAll) {
          localStorage.clear();
        } else if (customEvent.data.localStorageInfo) {
          for (const key of Object.keys(customEvent.data.localStorageInfo)) {
            localStorage.removeItem(key);
          }
        }

        customEvent.source.postMessage(
          {
            status: 'postToParent',
            key: customEvent.data.key,
            lastChildKey: customEvent.data.lastChildKey,
            parentDomain: customEvent.data.parentDomain,
            childDomains: customEvent.data.childDomains,
            once: customEvent.data.once,
          },
          customEvent.origin,
        );
        return;
      }
    }
  }

  // parent receive (remove iframe, eventListener)
  if (customEvent.data.status === 'postToParent') {
    const domains = customEvent.data.childDomains;
    let isDomain = false;

    for (const domain of Object.values(domains)) {
      const splitDomain: string = domain ? domain.split('/')[2].split(':')[0] : '';
      const splitOrigin: string = customEvent.origin ? customEvent.origin.split('/')[2].split(':')[0] : '';
      if (splitOrigin === splitDomain) {
        isDomain = true;
      }
    }
    // 3차 보안 위협 제거
    if (!isDomain) return;

    if (customEvent.data.once) {
      // iframe 제거함으로써 렌더링 최적화
      removeIframe(customEvent.data.key);
      if (customEvent.data.key === customEvent.data.lastChildKey) {
        removeListener();
      }
    } else {
      setPostCount();
    }
  }
};