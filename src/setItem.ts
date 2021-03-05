import { IKeyValueString } from "./shared";
import { 
  addListener,
  iframeLoadingSleep, 
  iframePostMessage, 
  resetPostCount, 
  postLoadingSleep, 
  getGuestDomains, 
  getPathName, 
  returnError,
  IIframePostMessage,
  IResultMessage,
} from "./shared";

type TKeys = string[] | string;
type TValues = string[] | string;

export const setItem = async (keys: TKeys, values: TValues): Promise<IResultMessage> => {
  try {
    let hostDomainKey: string = '';
    const setLocalStorageInfoObj: IKeyValueString = {};
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

