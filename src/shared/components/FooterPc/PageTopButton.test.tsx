import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageTopButton } from "./PageTopButton.tsx";

const buildImage = () => ({
  src: "/page-top.png",
  width: 120,
  height: 40,
  alt: "ページ上部へ戻る",
});

describe("FooterPc > PageTopButton > クリック操作", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ページ下部 / 検証: ページトップボタン押下 / 期待: 画面先頭へスムーズスクロールする", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);

    render(<PageTopButton image={buildImage()} />);

    await user.click(screen.getByRole("button", { name: "ページ上部へ戻る" }));

    expect(scrollTo, "scrollTo は先頭位置と smooth 指定で呼ばれる").toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
