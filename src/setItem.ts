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

export const setItem = async (key: string, value: string): Promise<IResultMessage> => {
  try {
    const result: IResultMessage = await baseSetItem({[key]: value});
    if (result.status === 'FAILED') throw result;

    return {
      status: 'SUCCESS'
    };
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const setItems = async (dataObj: IKeyValueString): Promise<IResultMessage> => {
  try {
    const result: IResultMessage = await baseSetItem(dataObj);
    if (result.status === 'FAILED') throw result;
    
    return {
      status: 'SUCCESS'
    };
  } catch (err) {
    console.error(err.message);
    return err;
  }
};

const baseSetItem = async (dataObj: IKeyValueString): Promise<IResultMessage> => {
  try {
    const pathName: string = getPathName();
    const guestDomains = await getGuestDomains();

    const errorMessage: IResultMessage = await returnError({
      keys: Object.keys(dataObj),
      values: Object.values(dataObj),
      pathName,
      guestDomains,
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
    for (const [key, value] of Object.entries(dataObj)) {
      localStorage.setItem(key, value);
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
        setLocalStorageInfoObj: dataObj,
      };
      iframePostMessage(postMessageObj);
    }
    await postLoadingSleep(domainsCount);
    return {
      status: 'SUCCESS'
    };
  } catch (err) {
    return {
      status: 'FAILED',
      message: err,
    };
  }
};
