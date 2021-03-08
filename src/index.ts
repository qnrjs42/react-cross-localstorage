import { getItem } from './getItem';
import { setItem } from './setItem';
import { clear } from './clearItem';
import { hostInit } from './hostInit';
import { removeItem } from './removeItem';
import { closeIframe } from './closeIframe';
import { setItemOnce } from './setItemOnce';
import { addListener as guestInit } from './shared';

export { getItem } from './getItem';
export { setItem } from './setItem';
export { clear } from './clearItem';
export { hostInit } from './hostInit';
export { removeItem } from './removeItem';
export { setItemOnce } from './setItemOnce';
export { addListener as guestInit } from './shared';
export { closeIframe as close } from './closeIframe';
export type { IResultMessage, IHostInit } from './interface';

const crossLocalstorage = {
  hostInit,
  guestInit,
  getItem,
  setItem,
  setItemOnce,
  removeItem,
  clear,
  close: closeIframe,
};

export default crossLocalstorage;
