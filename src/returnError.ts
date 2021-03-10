import { IResultMessage } from "./interface";

export const returnError = async (data: any): Promise<IResultMessage> => {
  let message = '';
  if (data.guestDomains && data.guestDomains === null) {
    message = 'guestDoamins Error. guestDomains are empties.';
  }
  if (data.pathName && !data.pathName) {
    message = 'pathName Error. pathName is empty.';
  }
  if (data.keys) {
    for (const key of data.keys) {
      if (key === '') {
        message = 'Key Error. Key is empty.';
        break;  
      }
    }
    if (data.keys.length === 0 || !data.keys) {
      message = 'Key Error. Key is empty.';
    }
  }
  if (data.values) {
    for (const value of data.values) {
      if (value === '') {
        message = 'Value Error. Value is empty.';
        break;  
      }
    }
    if (data.values.length === 0 || !data.values) {
      message = 'Value Error. Value is empty.';
    }
  }
  if (data.keys && (typeof data.keys === 'string' && Array.isArray(data.values))) {
    message = 'Value Error. Values are a lot.';
  }
  if (data.values &&  (typeof data.values === 'string' && Array.isArray(data.keys))) {
    message = 'Key Error. Keys are a lot.';
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
