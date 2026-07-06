import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MaintenanceLayout } from "./MaintenanceLayout.tsx";

describe("MaintenanceLayout > メンテナンス表示 > レイアウト", () => {
  it("メンテナンスページ / 検証: children表示 / 期待: ロゴと本文を表示", () => {
    render(
      <MaintenanceLayout>
        <p>メンテナンス本文</p>
      </MaintenanceLayout>,
    );

    expect(screen.getByAltText("レバテックフリーランス")).toBeInTheDocument();
    expect(screen.getByText("メンテナンス本文")).toBeInTheDocument();
  });
});
