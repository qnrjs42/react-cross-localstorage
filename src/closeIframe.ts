import { getGuestDomains, IResultMessage, returnError } from "./shared";

export const closeIframe = (): IResultMessage => {
  try {
    let parentDomainKey: string = '';
    const guestDomains = getGuestDomains();

    const errorMessage: IResultMessage = returnError({
      guestDomains
    });

    if (errorMessage.status === 'FAILED') {
      throw new Error(errorMessage.message);
    }

    for (const key of Object.keys(guestDomains!)) {
      if (key === document.domain.split('.')[0]) {
        parentDomainKey = key;
      } else {
        parentDomainKey = 'main';
      }

      if (parentDomainKey === key) continue;

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
