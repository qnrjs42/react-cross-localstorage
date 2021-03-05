import { getDoamins } from "../config/config";

export const closeIframe = () => {
  let parentDomainKey: string = '';

  for (const key of Object.keys(getDoamins())) {
    if (key === document.domain.split('.')[0]) {
      parentDomainKey = key;
    } else {
      parentDomainKey = 'main';
    }

    if (parentDomainKey === key) continue;

    const iframe = document.getElementById(key) as HTMLIFrameElement;
    iframe?.remove();
  } 
}
