export const getItem = (keys: string[] | string): string[] | string => {
  const localStorageArr: string[] = [];

  if (Array.isArray(keys)) {
    keys.map((key: string) => {
      if (localStorage.getItem(key) !== null) {
        localStorageArr.push(localStorage.getItem(key)!);
      } else {
        localStorageArr.push('');
      }
      return true;
    });
    return localStorageArr;
  } else {
    return localStorage.getItem(keys)!;
  }
};