import { addListener, filterData, IPostLocalStorage, iframeLoadingSleep, iframePostMessage, IIframePostMessage, resetPostCount, postLoadingSleep } from "./shared";

export const postLocalStorage = async (data: IPostLocalStorage) => {
  try {
    const infoData: IPostLocalStorage = filterData(data);
    const domainsCount = Object.keys(infoData.childDomains).length - 1;

    const lastChildKey: string = Object.keys(infoData.childDomains)[domainsCount];
    let parentDomainKey: string = '';
    addListener();

    await iframeLoadingSleep(domainsCount);
    resetPostCount();

    if (infoData.isRemove && !infoData.isRemoveAll) {
      for (const key of infoData.localStorageKeys!) {
        localStorage.removeItem(key);
      }
    } else if (infoData.isRemoveAll) {
      localStorage.clear();
    }
    
    for (const key in Object.keys(infoData.childDomains)) {
      if (key === infoData.parentDomain.split('.')[0]) {
        parentDomainKey = key;
      } else {
        parentDomainKey = 'main';
      }
    }

    for (const [key, domain] of Object.entries(infoData.childDomains)) {
      if (parentDomainKey === key) continue;

      const stringDomain = domain as string;
      const childDomain = stringDomain.split(infoData.pathname)[0];
      const postMessageObj: IIframePostMessage = {
        key, 
        lastChildKey, 
        parentDomain: infoData.parentDomain,
        childDomains: infoData.childDomains,
        childDomain,
        localStorageKeys: infoData.localStorageKeys,
      };

      if (!infoData.isRemove && !infoData.isRemoveAll) {
        iframePostMessage(postMessageObj);
      } else {
        if (infoData.isRemoveAll) {
          postMessageObj['isRemoveAll'] = infoData.isRemoveAll;
        }
        postMessageObj['isRemove'] = infoData.isRemove;
        postMessageObj['pathname'] = infoData.pathname;
        iframePostMessage(postMessageObj);
      }
    }
    await postLoadingSleep(domainsCount);
    return 'done';
  } catch (err) {
    console.error(err);
    return err;
  }
};