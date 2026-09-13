import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { reportClientError } from "@shared/lib/clientErrorReporter.ts";

import ErrorPage from "@/app/error.tsx";
import NotFoundPage from "@/app/not-found.tsx";

const { reportClientErrorMock } = vi.hoisted(() => ({
  reportClientErrorMock: vi.fn<typeof reportClientError>(),
}));

vi.mock(import("@shared/lib/clientErrorReporter.ts"), () => ({
  reportClientError: reportClientErrorMock,
}));

describe("app Error Pages > エラー表示 > 経路", () => {
  afterEach(() => {
    reportClientErrorMock.mockClear();
    vi.restoreAllMocks();
  });

  it("アプリエラー / 検証: 再読み込み / 期待: resetを呼ぶ", async () => {
    expect.hasAssertions();
    // Arrange
    const user = userEvent.setup();
    const reset = vi.fn<() => void>();

    // Act
    render(
      <ErrorPage
        error={new Error("failed")}
        reset={reset}
      />,
    );
    await user.click(screen.getByRole("button", { name: "再読み込み" }));

    // Assert
    expect(screen.getByRole("heading", { name: "ページを表示できませんでした" })).toBeVisible();
    expect(reportClientErrorMock).toHaveBeenCalledWith({ message: "failed" });
    expect(reset).toHaveBeenCalledOnce();
  });

  it("404 / 検証: 表示 / 期待: トップページ導線を表示", () => {
    expect.hasAssertions();
    // Arrange
    const expectedHref = "/";

    // Act
    render(<NotFoundPage />);

    // Assert
    expect(screen.getByRole("heading", { name: "ページが見つかりません" })).toBeVisible();
    expect(screen.getByRole("link", { name: "トップページへ戻る" })).toHaveAttribute(
      "href",
      expectedHref,
    );
  });
});
