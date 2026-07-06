"use client";

import { reportClientError } from "@shared/lib/clientErrorReporter.ts";
import { useEffect } from "react";

const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    reportClientError(
      error.digest ? { message: error.message, digest: error.digest } : { message: error.message },
    );
  }, [error]);

  return (
    <main>
      <h1>ページを表示できませんでした</h1>
      <p>時間をおいて再度お試しください。</p>
      <button
        type="button"
        onClick={reset}
      >
        再読み込み
      </button>
    </main>
  );
};

export default ErrorPage;
