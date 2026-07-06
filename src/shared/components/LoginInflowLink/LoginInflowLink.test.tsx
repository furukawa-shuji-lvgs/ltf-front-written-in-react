import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginInflowLink } from "./LoginInflowLink.tsx";

const { postLoginInflowInfoMock } = vi.hoisted(() => ({
  postLoginInflowInfoMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@shared/lib/loginInflow.ts", () => ({
  postLoginInflowInfo: postLoginInflowInfoMock,
}));

describe("LoginInflowLink > ログイン流入 > クリック", () => {
  afterEach(() => {
    postLoginInflowInfoMock.mockClear();
  });

  it("通常クリック / 検証: click / 期待: ログイン流入情報を送信", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LoginInflowLink href="#login">ログイン</LoginInflowLink>);

    // Act
    await user.click(screen.getByRole("link", { name: "ログイン" }));

    // Assert
    expect(postLoginInflowInfoMock).toHaveBeenCalledWith("#login");
  });

  it("既定動作キャンセル / 検証: click / 期待: ログイン流入情報を送信しない", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <LoginInflowLink
        href="#login"
        onClick={(event) => event.preventDefault()}
      >
        ログイン
      </LoginInflowLink>,
    );

    // Act
    await user.click(screen.getByRole("link", { name: "ログイン" }));

    // Assert
    expect(postLoginInflowInfoMock).not.toHaveBeenCalled();
  });
});
