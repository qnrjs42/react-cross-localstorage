import { clear } from './clearItem';
import { init } from './init';
import { removeItem } from './removeItem';
import { closeIframe } from './closeIframe';
import { getItem, getItems } from './getItem';
import { setItem, setItems } from './setItem';
import { addListener as guestInit } from './shared';

export { clear } from './clearItem';
export { init } from './init';
export { removeItem } from './removeItem';
export { getItem, getItems } from './getItem';
export { setItem, setItems } from './setItem';
export { addListener as guestInit } from './shared';
export { closeIframe as close } from './closeIframe';
export type { 
  IInit,
  IResultMessage,
  IKeyValueString as ISetItems,
} from './interface';

const crossLocalstorage = {
  init,
  guestInit,
  getItem,
  getItems,
  setItem,
  setItems,
  removeItem,
  clear,
  close: closeIframe,
};

export default crossLocalstorage;
