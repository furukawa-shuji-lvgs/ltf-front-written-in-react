import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OriginalLayout } from "./OriginalLayout.tsx";

describe("OriginalLayout > 独自ページ表示 > レイアウト", () => {
  it("独自ページ / 検証: children表示 / 期待: 渡した本文を保持する", () => {
    render(
      <OriginalLayout>
        <section aria-label="独自ページ本文">本文</section>
      </OriginalLayout>,
    );

    expect(screen.getByRole("region", { name: "独自ページ本文" })).toHaveTextContent("本文");
  });
});
