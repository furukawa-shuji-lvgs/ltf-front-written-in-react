/**
 * 入力値バリデーション
 *
 * 移行メモ: 移行元は @lv-levtech/domain の ValueObject（Email, FormattedPhoneNumber, LastName など）を
 * try/catch で判定していた。ltf-react では internal-libs/fusion/domain の source と同じ
 * 正規表現・文字数制限を判定関数として移植し、フォーム側から直接扱いやすい boolean API にしている。
 */

// ---- @lv-levtech/domain から移植した検証ルール ----

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+([a-zA-Z0-9-]+[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}))$/;
const EMAIL_ALL_MAX_LENGTH = 64;

const PHONE_NUMBER_REGEXP =
  /^(((0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1}|[5789]0[-(]?\d{4})[-)]?))\d{4}|0120[-(]?\d{3}[-)]?\d{3}|0{4}[-(]?0{3}[-)]?0{3}|0{3}[-(]?0{4}[-)]?0{4})$/;
const PHONE_NUMBER_WITH_AREA_CODE_REGEXP =
  /^0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1})[-)]?\d{4}$/;
const MOBILE_PHONE_NUMBER_REGEXP = /^0[5789]0[-(]?\d{4}[-)]?\d{4}$/;
const TOLL_FREE_NUMBER_REGEXP = /^0120[-(]?\d{3}[-)]?\d{3}$/;

const NAME_MAX_LENGTH = 32;
const NAME_MIN_LENGTH = 1;
const UNICODE_KATAKANA = "゠-ヺ";
const UNICODE_HIRAGANA = "぀-ゖ";
const UNICODE_ALPHABET = "A-Za-zＡ-Ｚａ-ｚ";
const UNICODE_NUMBER = "0-9０-９";
const UNICODE_KANJI = "々-〇㐀-鿿豈-﫿";
const UNICODE_DOUBLE_BYTE_SPACE = "　";
const UNICODE_HALF_WIDTH_SPACE = " ";
const UNICODE_PROLONGED_SOUND_MARK = "ー";

/**
 * ひらがな・全角スペース・長音符のみ（全角スペースのみは除外）
 */
const NAME_HIRAGANA_REGEX = new RegExp(
  `^(?![${UNICODE_DOUBLE_BYTE_SPACE}]+$)[${UNICODE_HIRAGANA}${UNICODE_DOUBLE_BYTE_SPACE}${UNICODE_PROLONGED_SOUND_MARK}]+$`,
);

/**
 * 漢字・ひらがな・カタカナ・英字(全角・半角)・数字(全角・半角)・全角スペース・半角スペース・長音符のみかチェック（全角スペースと半角スペースのみは除外）
 */
const NAME_ALL_REGEX = new RegExp(
  `^(?![${UNICODE_DOUBLE_BYTE_SPACE}${UNICODE_HALF_WIDTH_SPACE}]+$)[${UNICODE_KATAKANA}${UNICODE_HIRAGANA}${UNICODE_KANJI}${UNICODE_ALPHABET}${UNICODE_NUMBER}${UNICODE_DOUBLE_BYTE_SPACE}${UNICODE_HALF_WIDTH_SPACE}${UNICODE_PROLONGED_SOUND_MARK}]+$`,
);

const BIRTHDAY_YEAR_MIN = 1700;

/**
 * 姓、姓（ひらがな）、名、名（ひらがな）共通のルール（@lv-levtech/domain の Name 相当）
 */
const isValidName = (value: string): boolean =>
  value.length <= NAME_MAX_LENGTH && value.length >= NAME_MIN_LENGTH && NAME_ALL_REGEX.test(value);

// ---- バリデーター（移行元と同一のシグネチャ） ----

export const emailValidator = (email: string) => {
  if (!EMAIL_REGEXP.test(email)) return false;
  // biome-ignore lint/suspicious/noControlCharactersInRegex: @lv-levtech/domain の Email.tryValid の全角判定を移植
  if (email.match(/[^\x01-\x7E]/)) return false;
  return email.length <= EMAIL_ALL_MAX_LENGTH;
};

export const phoneValidator = (name: string) => {
  if (PHONE_NUMBER_REGEXP.test(name)) return true;
  // @lv-levtech/domain の FormattedPhoneNumber.tryValid と同じ判定順
  return (
    PHONE_NUMBER_WITH_AREA_CODE_REGEXP.test(name) &&
    MOBILE_PHONE_NUMBER_REGEXP.test(name) &&
    TOLL_FREE_NUMBER_REGEXP.test(name)
  );
};

export const lastNameValidator = (lastName: string) => isValidName(lastName);

export const firstNameValidator = (firstName: string) => isValidName(firstName);

export const lastNameKanaHiraganaValidator = (name: string) =>
  isValidName(name) && NAME_HIRAGANA_REGEX.test(name);

export const firstNameKanaHiraganaValidator = (name: string) =>
  isValidName(name) && NAME_HIRAGANA_REGEX.test(name);

export const yearValidator = (year: string) => {
  const currentYear = new Date().getFullYear();
  // 下限はfusionの下限と合わせる／上限は18歳〜に該当する年
  return Number(year) >= BIRTHDAY_YEAR_MIN && Number(year) <= currentYear - 18;
};

export const monthValidator = (month: string) => {
  // 1〜12以外はFalseを返す
  return !!(Number(month) >= 1 && Number(month) <= 12);
};

// 年月の選択値により日の選択肢を再計算する
const getValidDays = (year: number, month: number) => {
  const size = year && month ? new Date(year, month, 0).getDate() : 31;
  const days = [...Array(size)].map((_, i) => i + 1);
  return days;
};

export const birthdayYearValidator = (value: string) => {
  // 空文字の場合は入力必須のエラーメッセージのみ表示したいので、本バリデーションは適用しない
  if (!value) return true;
  const year = value.split("/")[0] || "";
  return year.length === 4 && yearValidator(year);
};

export const birthdayMonthValidator = (value: string) => {
  // 空文字の場合は入力必須のエラーメッセージのみ表示したいので、本バリデーションは適用しない
  if (!value) return true;
  const month = value.split("/")[1] || "";
  return month.length === 2 && monthValidator(month);
};

export const birthdayDayValidator = (value: string) => {
  // 空文字の場合は入力必須のエラーメッセージのみ表示したいので、本バリデーションは適用しない
  if (!value) return true;

  const [year, month, day] = value.split("/");
  if (day?.length !== 2) return false;

  const validDays = getValidDays(Number(year), Number(month));
  return validDays.includes(Number(day));
};
