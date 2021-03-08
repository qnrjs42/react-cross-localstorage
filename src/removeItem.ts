import { 
  addListener,
  getPathName, 
  resetPostCount, 
  getGuestDomains, 
  postLoadingSleep, 
  iframePostMessage, 
  iframeLoadingSleep,
  findKey, 
} from "./shared";
import { returnError } from './returnError';
import { IResultMessage, IIframePostMessage } from './interface';

type TKeys = string[] | string;

export const removeItem = async (keys: TKeys): Promise<IResultMessage> => {
  try {
    const guestDomains = await getGuestDomains();
    const pathName: string = getPathName();

    const errorMessage: IResultMessage = await returnError({
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
    const hostDomainKey: string = findKey(guestDomains!);

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
