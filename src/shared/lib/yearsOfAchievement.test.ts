import { afterEach, describe, expect, test, vi } from "vitest";

// モジュール読み込み時に現在時刻から計算されるため、システム時刻を固定してから動的 import する
const loadYearsOfAchievement = async () => {
  vi.resetModules();
  const { yearsOfAchievement } = await import("./yearsOfAchievement.ts");
  return yearsOfAchievement;
};

describe("yearsOfAchievement", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("設立記念日当日には満年数になること", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T00:00:00+09:00"));
    expect(await loadYearsOfAchievement()).toBe(21);
  });

  test("設立記念日前日には満年数に達しないこと", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T00:00:00+09:00"));
    expect(await loadYearsOfAchievement()).toBe(20);
  });

  test("設立記念日以降の年内は満年数のままであること", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-31T23:59:59+09:00"));
    expect(await loadYearsOfAchievement()).toBe(21);
  });
});
