declare module 'lunar-javascript' {
  interface Lunar {
    getMonthInChinese: () => string;
    getDayInChinese: () => string;
    getMonth: () => number;
    getDay: () => number;
    getJieQi: () => string;
    getFestivals: () => string[];
  }

  interface Solar {
    getLunar: () => Lunar;
    getFestivals: () => string[];
  }

  namespace Solar {
    function fromYmd(year: number, month: number, day: number): Solar;
  }
  
  export { Solar };
} 