let iframeOnLoadCount = 0;

export const getIframeOnLoadCount = () => {
  return iframeOnLoadCount;
};

export const setIframeOnLoadCount = () => {
  iframeOnLoadCount += 1;
};

export const resetIframeOnLoadCount = () => {
  iframeOnLoadCount = 0;
}

interface IKeyValueString {
  [key: string]: string;
}

interface IPublic {
  parentDomain: string;
  childDomains: IKeyValueString;
  pathname: string;
}

export interface ICrossStorage extends IPublic {
  localStorageKeys?: string[];
  isRemove?: boolean;
  isRemoveAll?: boolean;
}

export interface ICrossStorageOnce extends ICrossStorage {
  reactId?: string;
}

export interface IAddIframes extends IPublic {
  reactId?: string;
}

interface IMessageEventData {
  status: 'postToParent' | 'postToChild' | 'removeToChild';
  key: string;
  lastChildKey: string;
  parentDomain: string;
  childDomains: IKeyValueString;
  childDomain: string;
  pathname?: string;
  localStorageInfo?: IKeyValueString;
  isRemoveAll?: boolean;
  once? : boolean;
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
  childDomains: IKeyValueString;
  childDomain: string;
  isRemove?: boolean;
  isRemoveAll?: boolean;
  localStorageKeys?: string[];
  pathname?: string;
}

export const filterData = (data: ICrossStorage) => {
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

export const removeIframes = async (key: string) => {
  const iframe = document.getElementById(key) as HTMLIFrameElement;
  iframe?.remove();
};

export const addPostMessageListener = () => {
  window.addEventListener('message', postMessageEventHandler);
};

const removePostMessageListener = () => {
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
  if (customEvent.data.status === 'postToParent' && customEvent.data.once) {
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

    // iframe 제거함으로써 렌더링 최적화
    removeIframes(customEvent.data.key);
    if (customEvent.data.key === customEvent.data.lastChildKey) {
      removePostMessageListener();
    }
  }
};