import Link from "next/link";

const NotFoundPage = () => (
  <main>
    <h1>ページが見つかりません</h1>
    <p>お探しのページは移動または削除された可能性があります。</p>
    <Link href="/">トップページへ戻る</Link>
  </main>
);

export default NotFoundPage;
