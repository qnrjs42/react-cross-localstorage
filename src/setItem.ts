import {
  findKey,
  addListener,
  getPathName, 
  resetPostCount, 
  getGuestDomains, 
  postLoadingSleep, 
  iframePostMessage, 
  iframeLoadingSleep, 
} from "./shared";
import { returnError } from './returnError';
import { IResultMessage, IIframePostMessage, IKeyValueString } from './interface';

type TKeys = string[] | string;
type TValues = string[] | string;

export const setItem = async (keys: TKeys, values: TValues): Promise<IResultMessage> => {
  try {
    const setLocalStorageInfoObj: IKeyValueString = {};
    const guestDomains = await getGuestDomains();
    const pathName: string = getPathName();

    const errorMessage: IResultMessage = await returnError({
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
    resetPostCount(); // 이전에 post 요청 초기화
    const iframeLoadMessage: IResultMessage = await iframeLoadingSleep(domainsCount);

    if (iframeLoadMessage.status === 'FAILED') {
      throw new Error(iframeLoadMessage.message);
    }
    
    // compare and set host key
    const hostDomainKey: string = findKey(guestDomains!).trim();

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
      iframePostMessage(postMessageObj);
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
