export const getItem = (keys: string): string => {
  if (localStorage.getItem(keys)) {
    return localStorage.getItem(keys)!;
  }
  return '';
};

export const getItems = (keys: string[]): string[] => {
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
  } 
  return localStorageArr;
};