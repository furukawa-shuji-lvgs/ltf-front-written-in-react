import { describe, expect, test } from "vitest";
import { createDataLayerInnerHtml } from "./seo.ts";

describe("createDataLayerInnerHtml", () => {
  test("指定した値が対応するキーに埋め込まれること", () => {
    const result = createDataLayerInnerHtml({
      entryId: "e-1",
      inflowParam: "inflow",
      jobId: "j-1",
      viewBasketLogicad: "vb",
      rtbJobId: "rtb-1",
      freelanceExperience: "3",
      engineerExperience: "5",
      projectStatus: "open",
      category1Id: "c1",
      sha256PhoneNumber: "hash-phone",
      sha256EmailAddress: "hash-email",
      projectId: "p-1",
      siteType: "pc",
    });

    expect(result).toContain('dataLayer.push({"entry_id": "e-1"})');
    expect(result).toContain('dataLayer.push({"inflow_param": "inflow"})');
    expect(result).toContain('dataLayer.push({"job_id": "j-1"})');
    expect(result).toContain('dataLayer.push({"viewBasket_logicad": "vb"})');
    expect(result).toContain('dataLayer.push({"rtb_job_id": "rtb-1"})');
    expect(result).toContain('dataLayer.push({"freelance-experience": "3"})');
    expect(result).toContain('dataLayer.push({"engineer-experience": "5"})');
    expect(result).toContain('dataLayer.push({"project_status": "open"})');
    expect(result).toContain('dataLayer.push({"category_1_id": "c1"})');
    expect(result).toContain('dataLayer.push({"sha256_phone_number": "hash-phone"})');
    expect(result).toContain('dataLayer.push({"sha256_email_address": "hash-email"})');
    expect(result).toContain('dataLayer.push({"project_id": "p-1"})');
    expect(result).toContain('dataLayer.push({"site_type": "pc"})');
  });

  test("basketstatus_rtb は配列リテラルとして埋め込まれること", () => {
    const result = createDataLayerInnerHtml({ basketstatusRtb: '"a","b"' });
    expect(result).toContain('dataLayer.push({"basketstatus_rtb": ["a","b"]})');
  });

  test("未指定の値は空文字で埋め込まれること", () => {
    const result = createDataLayerInnerHtml({});
    expect(result).toContain('dataLayer.push({"entry_id": ""})');
    expect(result).toContain('dataLayer.push({"basketstatus_rtb": []})');
    expect(result).toContain('dataLayer.push({"site_type": ""})');
  });

  test("dataLayer の初期化コードが先頭に含まれること", () => {
    const result = createDataLayerInnerHtml({});
    expect(result.startsWith("window.dataLayer = window.dataLayer || [];")).toBe(true);
  });
});
