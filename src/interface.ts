export interface IKeyValueString {
  [key: string]: string;
}

export interface IBase {
  hostDomain: string;
  guestDomains: IKeyValueString;
}

export interface IPublic extends IBase {
  pathName: string;
}

export interface IPostLocalStorage extends IPublic {
  isRemove?: boolean;
  isRemoveAll?: boolean;
  localStorageKeys?: string[];
}

export interface IOpenPostLocalStorageClose extends IPostLocalStorage {
  reactId?: string;
}

export interface IInit {
  guestDomains: IKeyValueString;
  reactId?: string;
}

export interface IResultMessage {
  status: 'SUCCESS' | 'FAILED' | 'GUEST';
  message?: string;
}

export interface IMessageEventData {
  status: 'postToHost' | 'postToGuest' | 'removeToGuest';
  key: string;
  lastGuestKey: string;
  hostDomain: string;
  guestDomain: string;
  guestDomains: IKeyValueString;
  once? : boolean;
  isRemoveAll?: boolean;
  setLocalStorageInfoObj?: IKeyValueString;
  removeLocalStorageInfo?: string[] | string;
  pathName?: string;
}
export interface INewMessageEvent extends MessageEvent {
  target: Window;
  source: WindowProxy;
  data: IMessageEventData;
}

export interface IIframePostMessage {
  key: string;
  hostDomain: string;
  guestDomain: string;
  guestDomains: IKeyValueString;
  lastGuestKey: string;
  setLocalStorageInfoObj?: IKeyValueString;
  removeLocalStorageInfo?: string[] | string;
  isRemoveAll?: boolean;
}