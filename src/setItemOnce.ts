import { 
  findKey,
  addListener,
  getPathName, 
  setPathName,
  createIframe,
  resetPostCount, 
  getGuestDomains, 
  setGuestDomains, 
  postLoadingSleep, 
  initialResetSetting, 
} from "./shared";
import { returnError } from './returnError';
import { 
  IHostInit,
  IResultMessage,
  IKeyValueString,
  IIframePostMessage,
} from './interface';


type TKeys = string[] | string;
type TValues = string[] | string;

export const setItemOnce = async (data: IHostInit, keys: TKeys, values: TValues): Promise<IResultMessage> => {
  try {
    // 전역변수 초기화
    initialResetSetting();

    // 전역변수 할당
    setGuestDomains(data.guestDomains);
    setPathName(data.pathName);
    
    const setLocalStorageInfoObj: IKeyValueString = {};
    const reactId: string = data.reactId ? data.reactId : document.querySelectorAll('div')[0].id;
    const guestDomains = getGuestDomains();
    const pathName: string = getPathName();

    const errorMessage = returnError({
      guestDomains,
      pathName,
      keys,
      values
    });

    if (errorMessage.status === 'FAILED') {
      throw new Error(errorMessage.message);
    }

    const domainsCount: number = Object.keys(guestDomains!).length - 1;
    const lastGuestKey: string = Object.keys(guestDomains!)[domainsCount];

    addListener();
    resetPostCount();
    
    // compare and set host key
    const hostDomainKey: string = findKey(data.guestDomains);

    // host localstorage set
    if (Array.isArray(keys) && Array.isArray(values)) {
      for (let i = 0; i < keys.length; i++) {
        localStorage.setItem(keys[i], values[i]);
        setLocalStorageInfoObj[keys[i]] = values[i];
      }
    } else if (typeof keys === 'string' && typeof values === 'string') {
      localStorage.setItem(keys, values);
      setLocalStorageInfoObj[keys] = values;
    }

    for (const [key, domain] of Object.entries(guestDomains!)) {
      if (hostDomainKey === key) continue;

      const iframe = document.getElementById(key) as HTMLIFrameElement;

      const stringDomain: string = domain as string;
      const guestDomain: string = stringDomain.split(pathName)[0];
      const postMessageObj: IIframePostMessage = {
        key, 
        hostDomain: document.domain,
        guestDomain,
        guestDomains: guestDomains!,
        lastGuestKey, 
        setLocalStorageInfoObj,
      };
      // iframe이 기존에 없으면 생성
      if (iframe === null) {
        createIframe(iframe, key, domain, reactId, postMessageObj);
      }
    }
    await postLoadingSleep(domainsCount);
    return {
      status: 'SUCCESS'
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAILED',
      message: err,
    };
  }
};
