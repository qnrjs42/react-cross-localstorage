import { addListener } from './shared';
import { openIframe } from './openIframe';
import { closeIframe } from './closeIframe';
import { postLocalStorage } from './postLocalStorage';
import { openPostLocalStorageClose } from './openPostLocalStorageClose';

export { addListener } from './shared';
export { openIframe } from './openIframe';
export { closeIframe } from './closeIframe';
export { postLocalStorage } from './postLocalStorage';
export { openPostLocalStorageClose } from './openPostLocalStorageClose';
export type { IOpenIframe, IPostLocalStorage, IOpenPostLocalStorageClose } from './shared';

const crossLocalstorage = {
  openIframe,
  closeIframe,
  postLocalStorage,
  openPostLocalStorageClose,
  addListener,
};

export default crossLocalstorage;
