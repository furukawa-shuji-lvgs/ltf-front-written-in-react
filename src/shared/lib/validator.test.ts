import { describe, expect, test } from "vitest";
import {
  birthdayDayValidator,
  birthdayMonthValidator,
  birthdayYearValidator,
  emailValidator,
  firstNameKanaHiraganaValidator,
  firstNameValidator,
  lastNameKanaHiraganaValidator,
  lastNameValidator,
  monthValidator,
  phoneValidator,
  yearValidator,
} from "./validator.ts";

describe("emailValidator", () => {
  test("正しい形式のメールアドレスは true を返すこと", () => {
    expect(emailValidator("test@example.com")).toBe(true);
    expect(emailValidator("foo.bar+baz@sub.example.co.jp")).toBe(true);
  });

  test("形式が不正なメールアドレスは false を返すこと", () => {
    expect(emailValidator("")).toBe(false);
    expect(emailValidator("test")).toBe(false);
    expect(emailValidator("test@")).toBe(false);
    expect(emailValidator("@example.com")).toBe(false);
    expect(emailValidator("test@example")).toBe(false);
  });

  test("全角文字を含むメールアドレスは false を返すこと", () => {
    expect(emailValidator("ｔest@example.com")).toBe(false);
  });

  test("64文字を超えるメールアドレスは false を返すこと", () => {
    const local = "a".repeat(52);
    expect(emailValidator(`${local}@example.com`)).toBe(true); // 64文字ちょうど
    expect(emailValidator(`${local}a@example.com`)).toBe(false); // 65文字
  });
});

describe("phoneValidator", () => {
  test.each([
    "0312341234",
    "03-1234-1234",
    "03(1234)1234",
    "09012345678",
    "090-1234-5678",
    "0120-123-456",
  ])("%s は true を返すこと", (phone) => {
    expect(phoneValidator(phone)).toBe(true);
  });

  test("応募試験用のすべて0の番号は true を返すこと", () => {
    expect(phoneValidator("000-0000-0000")).toBe(true);
    expect(phoneValidator("0000-000-000")).toBe(true);
  });

  test.each([
    "",
    "12345",
    "1234567890",
    "abc-defg-hijk",
    "090-1234-56789",
  ])("%s は false を返すこと", (phone) => {
    expect(phoneValidator(phone)).toBe(false);
  });
});

describe("lastNameValidator / firstNameValidator", () => {
  test("漢字・ひらがな・カタカナ・英数字は true を返すこと", () => {
    expect(lastNameValidator("山田")).toBe(true);
    expect(lastNameValidator("やまだ")).toBe(true);
    expect(lastNameValidator("ヤマダ")).toBe(true);
    expect(firstNameValidator("Taro1")).toBe(true);
    expect(firstNameValidator("太郎　タロウ tarou")).toBe(true);
  });

  test("空文字は false を返すこと", () => {
    expect(lastNameValidator("")).toBe(false);
    expect(firstNameValidator("")).toBe(false);
  });

  test("32文字を超える場合は false を返すこと", () => {
    expect(lastNameValidator("あ".repeat(32))).toBe(true);
    expect(lastNameValidator("あ".repeat(33))).toBe(false);
  });

  test("記号を含む場合は false を返すこと", () => {
    expect(lastNameValidator("山田@")).toBe(false);
    expect(firstNameValidator("太郎!")).toBe(false);
  });

  test("スペースのみの場合は false を返すこと", () => {
    expect(lastNameValidator("　")).toBe(false);
    expect(firstNameValidator(" ")).toBe(false);
  });
});

describe("lastNameKanaHiraganaValidator / firstNameKanaHiraganaValidator", () => {
  test("ひらがな・長音符のみの場合は true を返すこと", () => {
    expect(lastNameKanaHiraganaValidator("やまだ")).toBe(true);
    expect(firstNameKanaHiraganaValidator("たろー")).toBe(true);
  });

  test("カタカナ・漢字・英数字を含む場合は false を返すこと", () => {
    expect(lastNameKanaHiraganaValidator("ヤマダ")).toBe(false);
    expect(lastNameKanaHiraganaValidator("山田")).toBe(false);
    expect(firstNameKanaHiraganaValidator("taro")).toBe(false);
  });

  test("空文字・全角スペースのみの場合は false を返すこと", () => {
    expect(lastNameKanaHiraganaValidator("")).toBe(false);
    expect(firstNameKanaHiraganaValidator("　")).toBe(false);
  });
});

describe("yearValidator", () => {
  test("1700年以上かつ18歳以上に該当する年は true を返すこと", () => {
    const maxYear = new Date().getFullYear() - 18;
    expect(yearValidator("1700")).toBe(true);
    expect(yearValidator(String(maxYear))).toBe(true);
  });

  test("範囲外の年は false を返すこと", () => {
    const maxYear = new Date().getFullYear() - 18;
    expect(yearValidator("1699")).toBe(false);
    expect(yearValidator(String(maxYear + 1))).toBe(false);
    expect(yearValidator("")).toBe(false);
  });
});

describe("monthValidator", () => {
  test("1〜12は true を返すこと", () => {
    expect(monthValidator("1")).toBe(true);
    expect(monthValidator("12")).toBe(true);
  });

  test("1〜12以外は false を返すこと", () => {
    expect(monthValidator("0")).toBe(false);
    expect(monthValidator("13")).toBe(false);
    expect(monthValidator("")).toBe(false);
  });
});

describe("birthdayYearValidator", () => {
  test("空文字の場合は true を返すこと", () => {
    expect(birthdayYearValidator("")).toBe(true);
  });

  test("有効な4桁の年は true を返すこと", () => {
    expect(birthdayYearValidator("1990/01/01")).toBe(true);
  });

  test("4桁でない年や範囲外の年は false を返すこと", () => {
    expect(birthdayYearValidator("199/01/01")).toBe(false);
    expect(birthdayYearValidator("1699/01/01")).toBe(false);
  });
});

describe("birthdayMonthValidator", () => {
  test("空文字の場合は true を返すこと", () => {
    expect(birthdayMonthValidator("")).toBe(true);
  });

  test("有効な2桁の月は true を返すこと", () => {
    expect(birthdayMonthValidator("1990/01/01")).toBe(true);
    expect(birthdayMonthValidator("1990/12/01")).toBe(true);
  });

  test("2桁でない月や範囲外の月は false を返すこと", () => {
    expect(birthdayMonthValidator("1990/1/01")).toBe(false);
    expect(birthdayMonthValidator("1990/13/01")).toBe(false);
  });
});

describe("birthdayDayValidator", () => {
  test("空文字の場合は true を返すこと", () => {
    expect(birthdayDayValidator("")).toBe(true);
  });

  test("月に存在する日は true を返すこと", () => {
    expect(birthdayDayValidator("1990/01/31")).toBe(true);
    expect(birthdayDayValidator("1990/04/30")).toBe(true);
  });

  test("月に存在しない日は false を返すこと", () => {
    expect(birthdayDayValidator("1990/04/31")).toBe(false);
    expect(birthdayDayValidator("1990/02/30")).toBe(false);
  });

  test("閏年の2月29日を正しく判定すること", () => {
    expect(birthdayDayValidator("2000/02/29")).toBe(true);
    expect(birthdayDayValidator("2001/02/29")).toBe(false);
  });

  test("2桁でない日は false を返すこと", () => {
    expect(birthdayDayValidator("1990/01/1")).toBe(false);
  });
});
