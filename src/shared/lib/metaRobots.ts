/**
 * 各ページ用のmeta robots設定（アルファベット順）
 * ページが追加されたら記述を追加
 */
export const META_ROBOTS_NOINDEX_NOFOLLOW = "noindex,nofollow";
export const META_ROBOTS_INDEX_FOLLOW = "index,follow";

const MetaRobots: { [key: string]: string } = {
  // "index,follow" 以外のものだけ指定
  "entry-complete": META_ROBOTS_NOINDEX_NOFOLLOW,
  "entry-input-chat-id": META_ROBOTS_NOINDEX_NOFOLLOW,
  "entry-input-id-short": META_ROBOTS_NOINDEX_NOFOLLOW,
  "entry-short-complete": META_ROBOTS_NOINDEX_NOFOLLOW,
  "friend-cp": META_ROBOTS_NOINDEX_NOFOLLOW,
  "friend-cp-complete": META_ROBOTS_NOINDEX_NOFOLLOW,
  maintenance: META_ROBOTS_NOINDEX_NOFOLLOW,
  "member-input-short": META_ROBOTS_NOINDEX_NOFOLLOW,
  "member-complete": META_ROBOTS_NOINDEX_NOFOLLOW,
  "member-short-complete": META_ROBOTS_NOINDEX_NOFOLLOW,
  "project-undecided": META_ROBOTS_NOINDEX_NOFOLLOW,
};

export const metaRobotsMapping = (path: string): string => {
  // LPはすべてnoindex, nofollow
  if (path.startsWith("lp")) {
    return META_ROBOTS_NOINDEX_NOFOLLOW;
  }

  const content = MetaRobots[path];
  if (content) {
    return content;
  }
  // default MetaRobots
  return META_ROBOTS_INDEX_FOLLOW;
};
