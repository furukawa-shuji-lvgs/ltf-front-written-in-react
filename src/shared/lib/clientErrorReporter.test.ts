import { afterEach, describe, expect, it, vi } from "vitest";

import { requireString, requireValue } from "../../../tests/assertions.ts";
import { buildClientErrorReportPayload, reportClientError } from "./clientErrorReporter.ts";

const fetchMock = vi.fn<typeof fetch>();

describe("clientErrorReporter > Client Error > 送信", () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("エラー情報 / 検証: report / 期待: client-errors APIへPOST", () => {
    expect.hasAssertions();
    // Arrange
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(null, { status: 204 })));
    globalThis.history.replaceState(null, "", "/guide/?sip=e2e");

    // Act
    reportClientError({ message: "failed", digest: "digest-1" });

    // Assert
    const [, requestInit] = requireValue(fetchMock.mock.calls[0]);
    const requestBody = requireString(requestInit?.body);
    expect(requestBody).toBeTypeOf("string");
    const body: unknown = JSON.parse(requestBody);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/client-errors",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(body).toMatchObject({
      message: "failed",
      digest: "digest-1",
      path: "/guide/?sip=e2e",
      userAgent: globalThis.navigator.userAgent,
    });
  });

  it("指定済みpayload / 検証: payload生成 / 期待: pathとuserAgentを上書きしない", () => {
    expect.hasAssertions();
    // Arrange
    const report = {
      message: "failed",
      path: "/custom/",
      userAgent: "custom-agent",
    };

    // Act
    const payload = buildClientErrorReportPayload(report);

    // Assert
    expect(payload).toStrictEqual({
      message: "failed",
      path: "/custom/",
      userAgent: "custom-agent",
    });
  });
});
