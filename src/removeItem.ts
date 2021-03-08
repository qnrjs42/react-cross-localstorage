import { 
  addListener,
  getPathName, 
  resetPostCount, 
  getGuestDomains, 
  postLoadingSleep, 
  iframePostMessage, 
  iframeLoadingSleep, 
} from "./shared";
import { returnError } from './returnError';
import { IResultMessage, IIframePostMessage } from './interface';

type TKeys = string[] | string;

export const removeItem = async (keys: TKeys): Promise<IResultMessage> => {
  try {
    let hostDomainKey: string = '';
    const guestDomains = getGuestDomains();
    const pathName: string = getPathName();

    const errorMessage: IResultMessage = returnError({
      guestDomains,
      pathName,
      keys,
    });

    if (errorMessage.status === 'FAILED') {
      throw new Error(errorMessage.message);
    }

    const domainsCount: number = Object.keys(guestDomains!).length - 1;
    const lastGuestKey: string = Object.keys(guestDomains!)[domainsCount];

    addListener();
    resetPostCount();
    const iframeLoadMessage: IResultMessage = await iframeLoadingSleep(domainsCount);

    if (iframeLoadMessage.status === 'FAILED') {
      throw new Error(iframeLoadMessage.message);
    }
    
    // compare and set host key
    for (const key in Object.keys(guestDomains!)) {
      if (key === document.domain.split('.')[0]) {
        hostDomainKey = key;
      } else {
        hostDomainKey = 'main';
      }
    }

    // host localstorage remove
    if (Array.isArray(keys)) {
      keys.map((key: string) => {
        return localStorage.removeItem(key);
      });
    } else if (typeof keys === 'string') {
      localStorage.removeItem(keys);
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
        removeLocalStorageInfo: keys,
      };
      iframePostMessage(postMessageObj);
    }
    await postLoadingSleep(domainsCount);
    return {
      status: 'SUCCESS',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAILED',
      message: err,
    };
  }
};
