import { 
  IResultMessage,
  IKeyValueString, 
  INewMessageEvent, 
  IMessageEventData, 
  IIframePostMessage, 
} from "./interface";

let iframeOnLoadCount = 0;
let postCount = 0;
let guestDomains: IKeyValueString | null = null;
let pathName = '';

export const getIframeOnLoadCount = (): number => {
  return iframeOnLoadCount;
};
export const setIframeOnLoadCount = (): void => {
  iframeOnLoadCount += 1;
};
export const resetIframeOnLoadCount = (): void => {
  iframeOnLoadCount = 0;
}

export const getPostCount = (): number => {
  return postCount;
};
export const setPostCount = (): void => {
  postCount += 1;
};
export const resetPostCount = (): void => {
  postCount = 0;
}

export const getPathName = (): string => {
  return pathName;
};
export const setPathName = (_pathName: string): void => {
  pathName = _pathName;
};
export const resetPathName = (): void => {
  pathName = '';
}

export const getGuestDomains = async (): Promise<IKeyValueString | null> => {
  return guestDomains;
};
export const setGuestDomains = (_guestDomains: IKeyValueString): void => {
  guestDomains = _guestDomains;
};
export const resetGuestDomains = (): void => {
  guestDomains = null;
}

export const initialResetSetting = () => {
  resetIframeOnLoadCount();
  resetPostCount();
  resetPathName();
  resetGuestDomains();
}

export const createIframe = (
  iframe: HTMLIFrameElement,
  key: string,
  domain: string,
  reactId: string,
  postMessageObj?: IIframePostMessage,
): void => {
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

export const iframeLoadingSleep = (iframeCount: number, failedCount: number = 0) => {
  return new Promise<IResultMessage>((resolve, reject) => {
    if (failedCount >= 10) {

      return reject({
        status: 'FAILED',
        message: 'Iframe Error. Iframe Load Failed.',
      });
    } 
    const _iframeOnLoadCount: number = getIframeOnLoadCount();
    if (_iframeOnLoadCount < iframeCount) {
      setTimeout(async () => {
        resolve(iframeLoadingSleep(iframeCount, failedCount++));
      }, 400);
    } else {
      return resolve({
        status: 'SUCCESS',
      });
    }
  });
};

export const postLoadingSleep = (postCount: number, failedCount: number = 0) => {
  return new Promise<IResultMessage>((resolve, reject) => {
    if (failedCount >= 10) {

      return reject({
        status: 'FAILED',
        message: 'Post Error. Post Failed.',
      });
    } 
    const postLoadCount: number = getPostCount();
    if (postLoadCount < postCount) {
      setTimeout(async () => {
        resolve(postLoadingSleep(postCount));
      }, 400);
    } else {
      return resolve({
        status: 'SUCCESS',
      });
    }
  });
};

export const findKey = (_guestDomains: IKeyValueString): string => {
  for (const key of Object.keys(_guestDomains!)) {
    if (key === document.domain.split('.')[0]) {
      return key;
    }
  }
  return 'main';
}

export const removeIframe = async (key: string): Promise<void> => {
  const iframe = document.getElementById(key) as HTMLIFrameElement;
  iframe?.remove();
};

export const addListener = (): void => {
  window.addEventListener('message', postMessageEventHandler);
};

export const removeListener = (): void => {
  window.removeEventListener('message', postMessageEventHandler);
};

export const iframePostMessage = (data: IIframePostMessage, once: boolean = false): void => {
  const postData: IMessageEventData = {
    status: 'postToGuest',
    key: data.key,
    lastGuestKey: data.lastGuestKey,
    hostDomain: data.hostDomain,
    guestDomains: data.guestDomains,
    guestDomain: data.guestDomain,
  };

  if (once) {
    // 한 번에 iframe 생성, post 전송 후 iframe 제거
    postData['once'] = true;
  } else {
    postData['once'] = false;
  }

  if (data.setLocalStorageInfoObj) {
    // setItem일 떄
    postData['setLocalStorageInfoObj'] = data.setLocalStorageInfoObj;
  }
  if (data.removeLocalStorageInfo) {
    // removeItem일 때
    postData['removeLocalStorageInfo'] = data.removeLocalStorageInfo;
  }

  if (!data.removeLocalStorageInfo && !data.isRemoveAll) {
    postData['status'] = 'postToGuest';
  } else {
    if (data.isRemoveAll) {
      postData['isRemoveAll'] = true;
    } else {
      postData['isRemoveAll'] = false;
    }
    postData['status'] = 'removeToGuest';
    postData['pathName'] = getPathName();
  }

  const iframe = document.getElementById(data.key) as HTMLIFrameElement;

  iframe.contentWindow?.postMessage(postData, data.guestDomain);
};

const postMessageEventHandler = (event: MessageEvent): void => {
  const customEvent = event as INewMessageEvent;

  // guest receive (set localstorage)
  // 1차 보안 위협 제거
  if (
    customEvent.origin.split('/')[2].split(':')[0] === customEvent.data.hostDomain &&
    customEvent.data.status === 'postToGuest'
  ) {
    // 2차 보안 위협 제거
    if (customEvent.data.guestDomain !== customEvent.target.location.origin) return;

    // localStorage 저장
    for (const [key, value] of Object.entries(customEvent.data.setLocalStorageInfoObj!)) {
      const realValue: string = value as string;
      localStorage.setItem(key, realValue);
    }
    // 성공 시 부모에게 메시지 전달
    customEvent.source.postMessage(
      {
        status: 'postToHost',
        key: customEvent.data.key,
        lastGuestKey: customEvent.data.lastGuestKey,
        hostDomain: customEvent.data.hostDomain,
        guestDomains: customEvent.data.guestDomains,
        once: customEvent.data.once,
      },
      customEvent.origin,
    );
  }

  //guest receive (remove localstorage)
  if (customEvent.data.status === 'removeToGuest') {
    const domains = customEvent.data.guestDomains;
    // 보안 위협 제거
    for (const domain of Object.values(domains)) {
      const splitDomain: string = domain ? domain?.split(customEvent.data.pathName!)[0] : '';
      if (splitDomain === customEvent.origin) {
        const removeLocalStorageInfo = customEvent.data.removeLocalStorageInfo;

        if (customEvent.data.isRemoveAll) {
          localStorage.clear();
        } else if (removeLocalStorageInfo) {
          if (Array.isArray(removeLocalStorageInfo)) {
            removeLocalStorageInfo.map((key: string) => {
              return localStorage.removeItem(key);
            });
          } else if (typeof removeLocalStorageInfo === 'string') {
            localStorage.removeItem(removeLocalStorageInfo);
          }
        }

        customEvent.source.postMessage(
          {
            status: 'postToHost',
            key: customEvent.data.key,
            lastGuestKey: customEvent.data.lastGuestKey,
            hostDomain: customEvent.data.hostDomain,
            guestDomains: customEvent.data.guestDomains,
            once: customEvent.data.once,
          },
          customEvent.origin,
        );
        return;
      }
    }
  }

  // parent receive (remove iframe, eventListener)
  if (customEvent.data.status === 'postToHost') {
    const domains = customEvent.data.guestDomains;
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
      if (customEvent.data.key === customEvent.data.lastGuestKey) {
        removeListener();
      }
    }
    setPostCount();
  }
};