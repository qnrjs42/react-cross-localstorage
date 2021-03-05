import { addListener, createIframe, filterData, IPostLocalStorage, IOpenPostLocalStorageClose, iframeLoadingSleep, IIframePostMessage, resetIframeOnLoadCount, resetPostCount } from "./shared";

export const openPostLocalStorageClose = async (data: IOpenPostLocalStorageClose) => {
  try {
    resetIframeOnLoadCount();
    resetPostCount();

    const infoData: IPostLocalStorage = filterData(data);

    const reactId: string = data.reactId ? data.reactId : document.querySelectorAll('div')[0].id;
    const lastChildKey: string = Object.keys(data.childDomains)[Object.keys(data.childDomains).length - 1];
    let parentDomainKey: string = '';
    addListener();

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

      const childDomain = domain.split(infoData.pathname)[0];
      const postMessageObj: IIframePostMessage = {
        key, 
        lastChildKey, 
        parentDomain: infoData.parentDomain,
        childDomains: infoData.childDomains,
        childDomain,
        localStorageKeys: infoData.localStorageKeys,
      };

      const iframe = document.getElementById(key) as HTMLIFrameElement;

      if (infoData.isRemove) {
        postMessageObj['isRemove'] = true;
      }
      if (infoData.isRemoveAll) {
        postMessageObj['isRemoveAll'] = true;
      }
      postMessageObj['pathname'] = infoData.pathname;
      createIframe(
        iframe,
        key,
        domain,
        reactId,
        postMessageObj,
      );
    }
    await iframeLoadingSleep(Object.keys(infoData.childDomains).length - 1);
    return 'done';
  } catch (err) {
    console.error(err);
    return err;
  }
};