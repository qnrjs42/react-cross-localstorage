import { findKey, getGuestDomains } from "./shared";
import { returnError } from './returnError';
import { IResultMessage } from './interface';

export const closeIframe = async (): Promise<IResultMessage> => {
  try {
    const guestDomains = await getGuestDomains();

    const errorMessage: IResultMessage = await returnError({
      guestDomains
    });

    if (errorMessage.status === 'FAILED') {
      throw new Error(errorMessage.message);
    }
    // set host key
    const hostDomainKey: string = findKey(guestDomains!);

    for (const key of Object.keys(guestDomains!)) {
      if (hostDomainKey === key) continue;

      const iframe = document.getElementById(key) as HTMLIFrameElement;
      iframe?.remove();
    }
    return {
      status: 'SUCCESS'
    }
  } catch (err) {
    console.error(err);
    return {
      status: 'FAILED',
      message: err
    }
  }
}
