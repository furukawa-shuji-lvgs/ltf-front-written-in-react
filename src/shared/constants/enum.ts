export enum ProjectPayType {
  // 指定なし
  PAY_TYPE_UNSPECIFIED = 0,
  // 精算あり
  SETTLEMENT = 1,
  // 固定
  FIXED = 2,
  // 時給
  HOURLY_WAGE = 3,
  // 交渉中
  NEGOTIATIONS = 4,
}

export enum ProjectContractType {
  // 不明
  CONTRACT_TYPE_UNKNOWN = 0,
  // 業務委託
  SUBCONTRACTOR = 1,
  // 派遣
  TEMPORARY = 2,
  // 紹介予定派遣
  EMPLOYMENT_PLACEMENT_DISPATCHING = 3,
  // 直接雇用
  DIRECT_EMPLOYMENT = 4,
}

export enum RemoteWorkAcceptable {
  // 指定なし
  REMOTE_WORK_UNSPECIFIED = 0,
  // 可
  REMOTE_WORK_ACCEPTABLE = 1,
  // 不可
  REMOTE_WORK_UNACCEPTABLE = 2,
  // 確認中
  REMOTE_WORK_CHECKING = 3,
}

export enum SkillCategoryType {
  // 不明
  UNKNOWN = 0,
  // 言語
  LANGUAGE = 1,
  // フレームワーク
  FRAMEWORK = 2,
  // DB
  DB = 3,
  // OS
  OS = 4,
  // デザインツール
  DESIGN_TOOL = 5,
  // その他ツール
  OTHER_TOOL = 6,
  // クラウド
  CLOUD = 7,
  // WEBサーバー
  WEB_SERVER = 8,
  // アプリケーションサーバー
  APPLICATION_SERVER = 9,
  // ゲームエンジン
  GAME_ENGINE = 10,
  // 統合開発環境
  IDE = 11,
  // 開発ツール
  DEVELOP_TOOL = 12,
}

export enum WeekWorkDaysCondition {
  // 指定なし
  UNSPECIFIED = 0,
  // 週5が絶対
  FIVE = 1,
  // 週4以上なら相談可
  FOUR = 2,
  // 週3以上なら相談可
  THREE = 3,
  // 週2以上なら相談可
  TWO = 4,
  // 週1以上なら相談可
  ONE = 5,
  // 時短可
  SHORTENING = 6,
  // その他・相談可能
  OTHER = 7,
}
