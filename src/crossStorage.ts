import { addPostMessageListener, filterData, ICrossStorage, iframeLoadingSleep, iframePostMessage, IIframePostMessage } from "./shared";

export const crossStorage = async (data: ICrossStorage) => {
  try {
    const infoData: ICrossStorage = filterData(data);

    const lastChildKey: string = Object.keys(infoData.childDomains)[Object.keys(infoData.childDomains).length - 1];
    let parentDomainKey: string = '';
    addPostMessageListener();

    console.log(infoData);
    await iframeLoadingSleep(Object.keys(infoData.childDomains).length - 1);


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
        parentDomainKey = 'root';
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
    return 'done';
  } catch (err) {
    console.error(err);
    return err;
  }
};