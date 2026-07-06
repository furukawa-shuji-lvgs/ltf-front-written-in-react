import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error.tsx";
import NotFoundPage from "@/app/not-found.tsx";

const { reportClientErrorMock } = vi.hoisted(() => ({
  reportClientErrorMock: vi.fn(),
}));

vi.mock("@shared/lib/clientErrorReporter.ts", () => ({
  reportClientError: reportClientErrorMock,
}));

describe("App Error Pages > エラー表示 > 経路", () => {
  afterEach(() => {
    reportClientErrorMock.mockClear();
    vi.restoreAllMocks();
  });

  it("アプリエラー / 検証: 再読み込み / 期待: resetを呼ぶ", async () => {
    // Arrange
    const user = userEvent.setup();
    const reset = vi.fn();

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
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("404 / 検証: 表示 / 期待: トップページ導線を表示", () => {
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
