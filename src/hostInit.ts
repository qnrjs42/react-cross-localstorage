import { 
  findKey,
  setPathName, 
  createIframe, 
  setGuestDomains, 
  initialResetSetting, 
} from "./shared";
import { IHostInit } from './interface';

export const hostInit = async (data: IHostInit) => {
  try {
    // 전역변수 초기화
    initialResetSetting();

    // 전역변수 할당
    setPathName(data.pathName);
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
  } catch (err) {
    console.error(err);
  }
}