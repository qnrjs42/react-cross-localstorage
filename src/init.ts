import { 
  findKey,
  addListener,
  setPathName, 
  createIframe, 
  findPathName,
  setGuestDomains, 
  initialResetSetting,
} from "./shared";
import { IInit, IResultMessage } from './interface';

export const init = (data: IInit): IResultMessage => {
  try {
    // 도메인 경로 탐색
    const guestPathName: string = findPathName(Object.values(data.guestDomains)[0]);

    // 게스트라면 리스너만 추가하고 나감
    if (window.location.pathname === guestPathName) {
      addListener();
      return {
        status: 'GUEST',
      }
    }

    // 전역변수 초기화
    initialResetSetting();

    // 전역변수 할당
    setPathName(guestPathName);
    setGuestDomains(data.guestDomains);

    const reactId: string = data.reactId ? data.reactId : document.querySelectorAll('div')[0].id;
    const hostDomainKey: string = findKey(data.guestDomains);

    for (const [key, domain] of Object.entries(data.guestDomains)) {
      // 현재 도메인 iframe 생성 제외
      if (hostDomainKey === key) continue;

      const iframe = document.getElementById(key) as HTMLIFrameElement;

      // iframe이 기존에 없으면 생성
      if (iframe === null) {
        createIframe(iframe, key, domain, reactId);
      }
    }
    return {
      status: 'SUCCESS',
    }
  } catch (err) {
    console.error(err);
    return {
      status: 'FAILED',
      message: err
    }
  }
}
