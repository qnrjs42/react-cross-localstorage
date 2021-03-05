import { IKeyValueString } from "./shared";

export const closeIframe = async (parentDomain: string, domains: IKeyValueString) => {
  let parentDomainKey: string = '';

  for (const key of Object.keys(domains)) {
    if (key === parentDomain.split('.')[0]) {
      parentDomainKey = key;
    } else {
      parentDomainKey = 'main';
    }

    if (parentDomainKey === key) continue;

    const iframe = document.getElementById(key) as HTMLIFrameElement;
    iframe?.remove();
  } 
}
