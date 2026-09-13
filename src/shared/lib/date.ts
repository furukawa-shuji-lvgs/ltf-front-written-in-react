const millisecondSuffix = -3;
const twoDigitSuffix = -2;

/**
 * Date型のFormat用のUtil関数
 *
 * @param date 指定のDate
 * @param format Yyyy-MM-dd HH:mm:ss
 * @returns Formatを整形した日付文字列
 */
export const formatDate = (date: Date, format: string): string => {
  const targetDate = new Date(date);

  let result = format.replaceAll("yyyy", targetDate.getFullYear().toString());
  result = result.replaceAll("MM", `0${targetDate.getMonth() + 1}`.slice(twoDigitSuffix));
  result = result.replaceAll("dd", `0${targetDate.getDate()}`.slice(twoDigitSuffix));
  result = result.replaceAll("HH", `0${targetDate.getHours()}`.slice(twoDigitSuffix));
  result = result.replaceAll("mm", `0${targetDate.getMinutes()}`.slice(twoDigitSuffix));
  result = result.replaceAll("ss", `0${targetDate.getSeconds()}`.slice(twoDigitSuffix));
  result = result.replaceAll("SSS", `00${targetDate.getMilliseconds()}`.slice(millisecondSuffix));
  result = result.replaceAll(
    "E",
    ["日", "月", "火", "水", "木", "金", "土"][targetDate.getDay()] ?? "",
  );

  return result;
};
