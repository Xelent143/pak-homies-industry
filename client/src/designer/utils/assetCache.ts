
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const REMOTE_BASE_URL = 'https://pub-b9476d3bd13d4e2d9e5ecfbbbeb57c74.r2.dev'; // Cloudflare R2 Bucket

/**
 * Ensures the 'models' directory exists in the Data directory.
 */
async function ensureModelsDirectory() {
    try {
        await Filesystem.mkdir({
            path: 'models',
            directory: Directory.Data,
            recursive: true,
        });
    } catch (e) {
        // Ignore error if directory already exists
        console.log('Models directory check:', e);
    }
}

/**
 * Downloads a file from a URL and saves it to the local filesystem.
 * @param path The relative path of the file (e.g. '/models/shirt.glb')
 * @param onProgress Callback for download progress (0-100)
 * @returns The local URI of the saved file
 */
export async function getCachedModelUrl(
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> {

    // 1. If running on Web
    if (!Capacitor.isNativePlatform()) {
        // If path starts with http, use as is.
        // If path starts with /, assume it's a local public asset (keep as is).
        // Otherwise, prepend R2 URL.
        const isLocal = path.startsWith('/');
        const rawUrl = path.startsWith('http') || isLocal ? path : `${REMOTE_BASE_URL}${path}`;

        const remoteUrl = encodeURI(rawUrl);
        console.log('🔗 Fetching model (Web):', remoteUrl);
        return remoteUrl;
    }

    const fileName = path.split('/').pop()!;
    const localPath = `models/${fileName}`;

    try {
        await ensureModelsDirectory();

        // 2. Check if file already exists locally
        const stat = await Filesystem.stat({
            path: localPath,
            directory: Directory.Data,
        });

        console.log('✅ Cache Hit:', localPath);
        return Capacitor.convertFileSrc(stat.uri); // Return WebView-friendly URL

    } catch (e) {
        console.log('⚠️ Cache Miss, Downloading:', path);
        // 3. File doesn't exist, download it

        // 3. File doesn't exist, download it

        try {
            // If path contains '/models/', strip it if you uploaded to root of R2. 
            // For now, we assume R2 structure matches local structure (has 'models' folder).
            // If 404s, user should create 'models' folder in R2 or we change this logic.
            // Ensure URL is properly encoded (handles spaces in filenames)
            const rawUrl = path.startsWith('http') ? path : `${REMOTE_BASE_URL}${path}`;
            const remoteUrl = encodeURI(rawUrl);
            console.log('🔗 Fetching from R2:', remoteUrl);

            // PRE-CHECK: Verify the URL exists using JS Fetch before invoking Native Download
            // This prevents saving "404 Not Found" HTML pages as .glb files
            const checkResponse = await fetch(remoteUrl, { method: 'HEAD' });
            if (!checkResponse.ok) {
                console.error(`❌ Remote Check Failed: ${checkResponse.status} ${checkResponse.statusText}`);
                throw new Error(`File not found on server (${checkResponse.status})`);
            }

            const contentType = checkResponse.headers.get('Content-Type');
            if (contentType && (contentType.includes('text/html') || contentType.includes('application/xml'))) {
                console.error(`❌ Invalid Content-Type: ${contentType}`);
                throw new Error('Remote file is not a 3D model (invalid content type)');
            }

            if (onProgress) onProgress(10);

            const downloadResult = await Filesystem.downloadFile({
                url: remoteUrl,
                path: localPath,
                directory: Directory.Data,
                recursive: true
            });

            if (onProgress) onProgress(100);

            console.log('✅ Downloaded to:', downloadResult.path);

            // Verify file size (catch 404 XMLs saved as content)
            const stat = await Filesystem.stat({
                path: localPath,
                directory: Directory.Data
            });

            if (stat.size < 2000) {
                // If smaller than 2KB, it's likely an XML error or empty file
                console.error('❌ Downloaded file too small (<2KB), likely 404 XML.');
                await Filesystem.deleteFile({
                    path: localPath,
                    directory: Directory.Data
                });
                throw new Error('Download failed: File not found on server (404)');
            }

            return Capacitor.convertFileSrc(stat.uri); // Return WebView-friendly URL

        } catch (downloadError) {
            console.error('❌ Download Failed:', downloadError);
            throw downloadError;
        }
    }
}
