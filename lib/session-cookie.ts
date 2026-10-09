export const SESSION_COOKIE = "session";
// JS-readable twin of the httpOnly session cookie, so the client can tell a
// session already exists and skip re-minting one on every page load.
export const SESSION_MARKER = "has_session";
