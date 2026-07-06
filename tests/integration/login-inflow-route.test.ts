import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/grpc/login/postLoginInflowInfo/route.ts";

const { infoMock } = vi.hoisted(() => ({
  infoMock: vi.fn(),
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    info: infoMock,
  })),
}));

describe("Login Inflow API > ログイン流入 > 経路", () => {
  it("有効payload / 検証: 受付 / 期待: Successを返してCookieに保存", async () => {
    // Arrange
    const request = new Request("http://localhost/api/grpc/login/postLoginInflowInfo", {
      method: "POST",
      body: JSON.stringify({
        startPage: "/guide/",
        endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
        referer: "https://example.com/ref",
        inflowMedia: "ltf",
      }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ result: "Success" });
    expect(response.headers.get("set-cookie")).toContain("login_inflow_info=");
    expect(infoMock).toHaveBeenCalledWith(
      {
        inflow: {
          startPage: "/guide/",
          endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
          referer: "https://example.com/ref",
          inflowMedia: "ltf",
        },
      },
      "Login inflow info received.",
    );
  });

  it("不正payload / 検証: 受付 / 期待: 400を返す", async () => {
    // Arrange
    const request = new Request("http://localhost/api/grpc/login/postLoginInflowInfo", {
      method: "POST",
      body: JSON.stringify({
        startPage: "/guide/",
        endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
        inflowMedia: "wrong",
      }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
  });
});
