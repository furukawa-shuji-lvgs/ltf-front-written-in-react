// レバレジーズ株式会社の設立年月日から起算
const dateOfEstablishment = new Date("2005-04-06T00:00:00+09:00");

/**
 * 創業年月日と現在時刻から算出した実績年数
 */
export const yearsOfAchievement: number =
  new Date(Date.now() - dateOfEstablishment.getTime()).getUTCFullYear() - 1970;
