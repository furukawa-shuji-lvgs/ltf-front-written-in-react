export interface DataLayer {
  readonly entryId?: string;
  readonly inflowParam?: string;
  readonly jobId?: string;
  readonly viewBasketLogicad?: string;
  readonly rtbJobId?: string;
  readonly freelanceExperience?: string;
  readonly engineerExperience?: string;
  readonly basketstatusRtb?: string;
  readonly projectStatus?: string;
  readonly category1Id?: string;
  readonly sha256PhoneNumber?: string;
  readonly sha256EmailAddress?: string;
  readonly projectId?: string;
  readonly siteType?: string;
}

/**
 * DataLayer 用 innerHTML を作成
 *
 * @remarks
 *   - IPアドレスは 旧app/plugins/publicIp.client.ts 相当のクライアント処理で dataLayer にセットする
 * @returns DataLayer を設定するスクリプト本文。
 */
export const createDataLayerInnerHtml = (
  dataLayer: DataLayer,
) => `window.dataLayer = window.dataLayer || [];
        dataLayer.push({"entry_id": "${dataLayer.entryId ?? ""}"});
        dataLayer.push({"inflow_param": "${dataLayer.inflowParam ?? ""}"});
        dataLayer.push({"job_id": "${dataLayer.jobId ?? ""}"})
        dataLayer.push({"viewBasket_logicad": "${dataLayer.viewBasketLogicad ?? ""}"});
        dataLayer.push({"basketstatus_rtb": [${dataLayer.basketstatusRtb ?? ""}]});
        dataLayer.push({"rtb_job_id": "${dataLayer.rtbJobId ?? ""}"});
        dataLayer.push({"freelance-experience": "${dataLayer.freelanceExperience ?? ""}"});
        dataLayer.push({"engineer-experience": "${dataLayer.engineerExperience ?? ""}"});
        dataLayer.push({"project_status": "${dataLayer.projectStatus ?? ""}"});
        dataLayer.push({"category_1_id": "${dataLayer.category1Id ?? ""}"});
        dataLayer.push({"sha256_phone_number": "${dataLayer.sha256PhoneNumber ?? ""}"});
        dataLayer.push({"sha256_email_address": "${dataLayer.sha256EmailAddress ?? ""}"});
        dataLayer.push({"project_id": "${dataLayer.projectId ?? ""}"});
        dataLayer.push({"site_type": "${dataLayer.siteType ?? ""}"});`;
