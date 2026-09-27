/**
 * Prefixes a public file with the base path the site is served from.
 *
 * At the root of a domain this is empty. On a host that serves the site from a subfolder
 * (GitHub project pages, for instance) the build sets NEXT_PUBLIC_BASE_PATH and every image,
 * logo and plate resolves under it. Next rewrites <Link> hrefs itself; plain file paths are ours.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE}${path}`;
