import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeaderPcShellClient } from "./HeaderPcShellClient.tsx";

const classNames = {
  baseHeader: "base",
  isFixed: "fixed",
  isShow: "show",
  isSticky: "sticky",
  layoutL: "layout-l",
};

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
  });
};

const renderShell = (props?: Partial<Parameters<typeof HeaderPcShellClient>[0]>) =>
  render(
    <HeaderPcShellClient
      isFixed={true}
      isSticky={false}
      isLayoutL={false}
      classNames={classNames}
      {...props}
    >
      content
    </HeaderPcShellClient>,
  );

const getHeader = () => screen.getByText("content").closest("header");

afterEach(() => {
  vi.restoreAllMocks();
  setScrollY(0);
});

describe("HeaderPcShellClient > 固定ヘッダー > スクロール", () => {
  it("固定ヘッダー / 検証: 閾値超過スクロール / 期待: 表示クラスを付与する", () => {
    // Arrange
    const callbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    setScrollY(0);
    renderShell();

    // Act
    act(() => {
      setScrollY(700);
      window.dispatchEvent(new Event("scroll"));
      callbacks[0]?.(0);
    });

    // Assert
    expect(getHeader()).toHaveClass("show");
  });

  it("固定ヘッダー / 検証: 連続スクロール後のunmount / 期待: RAFを重複予約せずcleanupする", () => {
    // Arrange
    const requestAnimationFrameMock = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1);
    const cancelAnimationFrameMock = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(() => undefined);
    const { unmount } = renderShell();

    // Act
    act(() => {
      setScrollY(700);
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
    });
    unmount();

    // Assert
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
  });
});
