import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
const REMOTE_BASE_URL = "https://pub-b9476d3bd13d4e2d9e5ecfbbbeb57c74.r2.dev";
async function ensureModelsDirectory() {
  try {
    await Filesystem.mkdir({
      path: "models",
      directory: Directory.Data,
      recursive: true
    });
  } catch (e) {
    console.log("Models directory check:", e);
  }
}
async function getCachedModelUrl(path, onProgress) {
  if (!Capacitor.isNativePlatform()) {
    const isLocal = path.startsWith("/");
    const rawUrl = path.startsWith("http") || isLocal ? path : `${REMOTE_BASE_URL}${path}`;
    const remoteUrl = encodeURI(rawUrl);
    console.log("🔗 Fetching model (Web):", remoteUrl);
    return remoteUrl;
  }
  const fileName = path.split("/").pop();
  const localPath = `models/${fileName}`;
  try {
    await ensureModelsDirectory();
    const stat = await Filesystem.stat({
      path: localPath,
      directory: Directory.Data
    });
    console.log("✅ Cache Hit:", localPath);
    return Capacitor.convertFileSrc(stat.uri);
  } catch (e) {
    console.log("⚠️ Cache Miss, Downloading:", path);
    try {
      const rawUrl = path.startsWith("http") ? path : `${REMOTE_BASE_URL}${path}`;
      const remoteUrl = encodeURI(rawUrl);
      console.log("🔗 Fetching from R2:", remoteUrl);
      const checkResponse = await fetch(remoteUrl, { method: "HEAD" });
      if (!checkResponse.ok) {
        console.error(`❌ Remote Check Failed: ${checkResponse.status} ${checkResponse.statusText}`);
        throw new Error(`File not found on server (${checkResponse.status})`);
      }
      const contentType = checkResponse.headers.get("Content-Type");
      if (contentType && (contentType.includes("text/html") || contentType.includes("application/xml"))) {
        console.error(`❌ Invalid Content-Type: ${contentType}`);
        throw new Error("Remote file is not a 3D model (invalid content type)");
      }
      if (onProgress) onProgress(10);
      const downloadResult = await Filesystem.downloadFile({
        url: remoteUrl,
        path: localPath,
        directory: Directory.Data,
        recursive: true
      });
      if (onProgress) onProgress(100);
      console.log("✅ Downloaded to:", downloadResult.path);
      const stat = await Filesystem.stat({
        path: localPath,
        directory: Directory.Data
      });
      if (stat.size < 2e3) {
        console.error("❌ Downloaded file too small (<2KB), likely 404 XML.");
        await Filesystem.deleteFile({
          path: localPath,
          directory: Directory.Data
        });
        throw new Error("Download failed: File not found on server (404)");
      }
      return Capacitor.convertFileSrc(stat.uri);
    } catch (downloadError) {
      console.error("❌ Download Failed:", downloadError);
      throw downloadError;
    }
  }
}
export {
  getCachedModelUrl
};
