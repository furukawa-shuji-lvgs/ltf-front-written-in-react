export type RedirectMap = Readonly<Record<string, string>>;

type RedirectValueMapper = (destination: string) => string;

export const createMapRedirectResolver =
  (redirectMap: RedirectMap, mapDestination: RedirectValueMapper = (destination) => destination) =>
  (path: string): string | null => {
    const destination = redirectMap[path];

    return destination ? mapDestination(destination) : null;
  };

export const createPrefixRedirectResolver =
  (sourcePaths: readonly string[], destination: string) =>
  (path: string): string | null =>
    sourcePaths.some((sourcePath) => path.startsWith(sourcePath)) ? destination : null;
