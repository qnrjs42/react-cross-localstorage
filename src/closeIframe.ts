import { getGuestDomains } from "./shared";
import { returnError } from './returnError';
import { IResultMessage } from './interface';

export const closeIframe = (): IResultMessage => {
  try {
    let hostDomainKey: string = '';
    const guestDomains = getGuestDomains();

    const errorMessage: IResultMessage = returnError({
      guestDomains
    });

    if (errorMessage.status === 'FAILED') {
      throw new Error(errorMessage.message);
    }

    for (const key of Object.keys(guestDomains!)) {
      if (key === document.domain.split('.')[0]) {
        hostDomainKey = key;
      } else {
        hostDomainKey = 'main';
      }

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
