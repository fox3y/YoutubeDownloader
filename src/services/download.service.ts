import { v4 as uuidv4 } from 'uuid';
import { DownloadOptions } from '../types/download.types';
import { ytdlpService } from './ytdlp.service';
import { AppError, ErrorCode } from '../utils/logger';

interface DownloadResult {
  file: Buffer;
  filename: string;
  mimeType: string;
}

class DownloadService {
  private activeDownloads = new Map<string, boolean>();

  async processDownload(url: string, quality: string): Promise<DownloadResult> {
    const downloadId = uuidv4();

    // Check concurrent downloads limit
    if (this.activeDownloads.size >= 2) {
      throw new AppError(
        ErrorCode.SERVER_ERROR,
        'Maximum concurrent downloads reached',
        429
      );
    }

    this.activeDownloads.set(downloadId, true);

    try {
      const options: DownloadOptions = {
        url,
        quality,
        timeout: 600000, // 10 minutes
        maxSizeMB: 500,
      };

      const result = await ytdlpService.download(options);

      return result;
    } finally {
      this.activeDownloads.delete(downloadId);
    }
  }
}

export const downloadService = new DownloadService();
