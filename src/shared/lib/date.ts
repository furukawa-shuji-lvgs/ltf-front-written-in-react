/**
 * Date型のFormat用のUtil関数
 * @param date 指定のDate
 * @param format yyyy-MM-dd HH:mm:ss
 * @returns Formatを整形した日付文字列
 */
export const formatDate = (date: Date, format: string): string => {
  const targetDate = new Date(date);

  format = format.replace(/yyyy/g, targetDate.getFullYear().toString());
  format = format.replace(/MM/g, `0${targetDate.getMonth() + 1}`.slice(-2));
  format = format.replace(/dd/g, `0${targetDate.getDate()}`.slice(-2));
  format = format.replace(/HH/g, `0${targetDate.getHours()}`.slice(-2));
  format = format.replace(/mm/g, `0${targetDate.getMinutes()}`.slice(-2));
  format = format.replace(/ss/g, `0${targetDate.getSeconds()}`.slice(-2));
  format = format.replace(/SSS/g, `00${targetDate.getMilliseconds()}`.slice(-3));
  format = format.replace(
    /E/g,
    ["日", "月", "火", "水", "木", "金", "土"][targetDate.getDay()] ?? "",
  );

  return format;
};
