function isRunningOnServer(): boolean {
  return typeof window === "undefined";
}

function base64Decode(str: string): string {
  if (isRunningOnServer()) {
    // No servidor Node.js
    return Buffer.from(str, "base64").toString("binary");
  } else {
    // No navegador
    return window.atob(str);
  }
}

export function verifyToken(token: string): boolean {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(base64Decode(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}
