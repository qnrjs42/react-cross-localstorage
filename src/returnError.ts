import { IResultMessage } from "./interface";

export const returnError = (data: any): IResultMessage => {
  let message = '';
  if (data.guestDomains && data.guestDomains === null) {
    message = 'guestDoamins Error. 게스트도메인이 비워져있습니다.';
  }
  if (data.pathName && data.pathName === '') {
    message = 'pathName Error. pathName이 비워져있습니다.';
  }
  if (data.keys && (data.keys.length === 0 || data.keys === '')) {
    message = 'Key Error. key가 비워져있습니다.';
  }
  if (data.values && (data.values.length === 0 || data.values === '')) {
    message = 'Value Error. Value가 비워져있습니다.';
  }
  if (data.keys && (typeof data.keys === 'string' && Array.isArray(data.values))) {
    message = 'Value Error. Key보다 Value가 더 많습니다.';
  }
  if (data.values &&  (typeof data.values === 'string' && Array.isArray(data.keys))) {
    message = 'Key Error. Value보다 Key가 더 많습니다.';
  }

  if (message !== '') {
    return {
      status: 'FAILED',
      message,
    }
  }
  return {
    status: 'SUCCESS',
  }
};