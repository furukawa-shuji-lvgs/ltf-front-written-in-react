export enum ProjectPayType {
  PAY_TYPE_UNSPECIFIED = 0, // 指定なし
  SETTLEMENT = 1, // 精算あり
  FIXED = 2, // 固定
  HOURLY_WAGE = 3, // 時給
  NEGOTIATIONS = 4, // 交渉中
}

export enum ProjectContractType {
  CONTRACT_TYPE_UNKNOWN = 0, // 不明
  SUBCONTRACTOR = 1, // 業務委託
  TEMPORARY = 2, // 派遣
  EMPLOYMENT_PLACEMENT_DISPATCHING = 3, // 紹介予定派遣
  DIRECT_EMPLOYMENT = 4, // 直接雇用
}

export enum RemoteWorkAcceptable {
  REMOTE_WORK_UNSPECIFIED = 0, // 指定なし
  REMOTE_WORK_ACCEPTABLE = 1, // 可
  REMOTE_WORK_UNACCEPTABLE = 2, // 不可
  REMOTE_WORK_CHECKING = 3, // 確認中
}

export enum SkillCategoryType {
  UNKNOWN = 0, // 不明
  LANGUAGE = 1, // 言語
  FRAMEWORK = 2, // フレームワーク
  DB = 3, // DB
  OS = 4, // OS
  DESIGN_TOOL = 5, // デザインツール
  OTHER_TOOL = 6, // その他ツール
  CLOUD = 7, // クラウド
  WEB_SERVER = 8, // WEBサーバー
  APPLICATION_SERVER = 9, // アプリケーションサーバー
  GAME_ENGINE = 10, // ゲームエンジン
  IDE = 11, // 統合開発環境
  DEVELOP_TOOL = 12, // 開発ツール
}

export enum WeekWorkDaysCondition {
  UNSPECIFIED = 0, // 指定なし
  FIVE = 1, // 週5が絶対
  FOUR = 2, // 週4以上なら相談可
  THREE = 3, // 週3以上なら相談可
  TWO = 4, // 週2以上なら相談可
  ONE = 5, // 週1以上なら相談可
  SHORTENING = 6, // 時短可
  OTHER = 7, // その他・相談可能
}
