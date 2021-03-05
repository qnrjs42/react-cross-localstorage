import { createIframe, IHostInit, initialResetSetting, setGuestDomains, setPathName } from "./shared";

export const hostInit = async (data: IHostInit) => {
  try {
    // 전역변수 초기화
    initialResetSetting();

    // 전역변수 할당
    setGuestDomains(data.guestDomains);
    setPathName(data.pathName);

    const reactId: string = data.reactId ? data.reactId : document.querySelectorAll('div')[0].id;
    let parentDomainKey: string = '';

    for (const key in Object.keys(data.guestDomains)) {
      if (key === document.domain.split('.')[0]) {
        parentDomainKey = key;
      } else {
        parentDomainKey = 'main';
      }
    }

    for (const [key, domain] of Object.entries(data.guestDomains)) {
      // 현재 도메인 iframe 생성 제외
      if (parentDomainKey === key) continue;

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