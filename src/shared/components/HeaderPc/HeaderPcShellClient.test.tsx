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
  Object.defineProperty(globalThis, "scrollY", {
    configurable: true,
    value,
  });
};

const renderShell = (props?: Partial<Parameters<typeof HeaderPcShellClient>[0]>) =>
  render(
    <HeaderPcShellClient
      isFixed
      isSticky={false}
      isLayoutL={false}
      classNames={classNames}
      {...props}
    >
      content
    </HeaderPcShellClient>,
  );

const getHeader = () => screen.getByText("content").closest("header");

describe("headerPcShellClient > 固定ヘッダー > スクロール", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setScrollY(0);
  });

  it("固定ヘッダー / 検証: 閾値超過スクロール / 期待: 表示クラスを付与する", () => {
    expect.hasAssertions();
    // Arrange
    const callbacks: FrameRequestCallback[] = [];
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    vi.spyOn(globalThis, "cancelAnimationFrame").mockReturnValue();
    setScrollY(0);
    renderShell();

    // Act
    act(() => {
      setScrollY(700);
      globalThis.dispatchEvent(new Event("scroll"));
      callbacks[0]?.(0);
    });

    // Assert
    expect(getHeader()).toHaveClass("show");
  });

  it("固定ヘッダー / 検証: 連続スクロール後のunmount / 期待: RAFを重複予約せずcleanupする", () => {
    expect.hasAssertions();
    // Arrange
    const requestAnimationFrameMock = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockReturnValue(1);
    const cancelAnimationFrameMock = vi.spyOn(globalThis, "cancelAnimationFrame").mockReturnValue();
    const { unmount } = renderShell();

    // Act
    act(() => {
      setScrollY(700);
      globalThis.dispatchEvent(new Event("scroll"));
      globalThis.dispatchEvent(new Event("scroll"));
    });
    unmount();

    // Assert
    expect(requestAnimationFrameMock).toHaveBeenCalledOnce();
    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
  });
});
