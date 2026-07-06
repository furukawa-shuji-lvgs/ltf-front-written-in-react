/**
 * 各ページ用のTDKHのkey設定（アルファベット順）
 * ページが追加されたら記述を追加(route名からMapping)
 */
const Tdkh = {
  "achievement-interview-list": "interview_top",
  "achievement-interview-list-pid": "interview_top",
  "achievement-interview-detail-id": "interview_detail",
  "consultation-detail-id": "consultation_detail",
  "entry-complete": "entry_complete",
  "entry-input-chat-id": "proposal",
  "entry-input-id-short": "proposal",
  "entry-short-complete": "entry_complete",
  friend: "friend",
  "friend-cp": "friend_cp",
  "friend-cp-complete": "friend_cp_complete",
  guide: "guide",
  "guide-detail-id": "guide_detail",
  "guide-freelance-start-guide": "guide_freelance-start-guide",
  "guide-ppage": "guide",
  "guide-tag-tagId": "guide_tag",
  "guide-tag-tagId-ppage": "guide_tag",
  help: "help",
  "member-complete": "member_complete",
  "member-input-chat": "member_input",
  "member-input-short": "member_input",
  "member-short-complete": "member_complete",
  "project-detail-id": "project_detail",
  "project-marketprice": "project_marketprice",
  "project-search": "project_search",
  "project-search-ppage": "project_search",
  "project-closedsearch": "project_closedsearch",
  "project-closedsearch-ppage": "project_closedsearch",
  "project-undecided": "project_undecided",
  service: "service",
  "service-merit-accountant-1": "service_merit_accountant_1",
  "service-onsite": "service_onsite",
  "service-pickup": "service_pickup",
  "service-platform": "service_platform",
  "service-platform-member": "service_platform_member",
  "service-first-freelance": "first-freelance",
  "service-assess": "service_assess",
  "service-assess-complete": "service_assess_complete",
  "service-phone": "service_phone",
  sitemap: "sitemap",
  women: "women",
  word: "keyword_top",
  "word-ppage": "keyword_top",
  "word-list-id": "keyword_list",
  "word-list-id-ppage": "keyword_list",
};

type TdkhKey = keyof typeof Tdkh;
const isTdkhKey = (key: string): key is TdkhKey => key in Tdkh;

export const tdkhMapping = (routeName: TdkhKey | string): string => {
  if (isTdkhKey(routeName)) {
    return Tdkh[routeName];
  }

  return "default";
};
