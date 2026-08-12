import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { DownloadOptions } from '../types/download.types';
import { AppError, ErrorCode } from '../utils/logger';
import { env } from '../config/env';
import { ffmpegService } from './ffmpeg.service';

interface DownloadResult {
  file: Buffer;
  filename: string;
  mimeType: string;
}

class YtdlpService {
  async download(options: DownloadOptions): Promise<DownloadResult> {
    const { url, quality, timeout, maxSizeMB } = options;

    // Create temporary directory
    const tempDir = join(process.cwd(), 'downloads', Date.now().toString());
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Determine format based on quality
      const format = this.getFormat(quality);
      const outputTemplate = join(tempDir, 'video.%(ext)s');

      // Build yt-dlp arguments securely - no string concatenation
      const args = [
        '--no-playlist',
        '--no-warnings',
        '-f',
        format,
        '-o',
        outputTemplate,
        '--max-filesize',
        `${maxSizeMB}M`,
        '--merge-output-format',
        'mp4',
        '--embed-metadata',
        url,
      ];

      // Execute yt-dlp with spawn
      const result = await this.executeCommand(env.YTDLP_PATH, args, timeout);

      if (result.code !== 0) {
        throw new AppError(
          ErrorCode.DOWNLOAD_FAILED,
          `Download failed: ${result.stderr}`,
          500
        );
      }

      // Find the downloaded file
      const files = await fs.readdir(tempDir);
      const videoFile = files.find((f) => f !== 'video.part' && f !== 'video.frag');

      if (!videoFile) {
        throw new AppError(
          ErrorCode.DOWNLOAD_FAILED,
          'No file was downloaded',
          500
        );
      }

      const filePath = join(tempDir, videoFile);
      const fileBuffer = await fs.readFile(filePath);

      // Check file size
      const fileSizeMB = fileBuffer.length / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        await fs.unlink(filePath);
        throw new AppError(
          ErrorCode.FILE_TOO_LARGE,
          `File too large: ${fileSizeMB.toFixed(2)}MB`,
          400
        );
      }

      // Determine MIME type
      let mimeType = this.getMimeType(videoFile);
      let finalFile = videoFile;
      let finalBuffer = fileBuffer;

      // Convert to MP3 if requested
      if (quality === 'mp3' && !videoFile.endsWith('.mp3')) {
        const mp3Path = join(tempDir, 'output.mp3');
        await ffmpegService.convertToMp3(filePath, mp3Path);
        
        finalBuffer = await fs.readFile(mp3Path);
        finalFile = 'output.mp3';
        mimeType = 'audio/mpeg';
        
        // Clean up original file
        await fs.unlink(filePath);
      }

      return {
        file: finalBuffer,
        filename: finalFile,
        mimeType,
      };
    } finally {
      // Cleanup temporary directory
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error('Failed to cleanup temp directory:', error);
      }
    }
  }

  private getFormat(quality: string): string {
    if (quality === 'mp3') {
      return 'bestaudio/best';
    }

    const height = parseInt(quality);
    // Use formato mais flexível: tenta vídeo+áudio na qualidade especificada,
    // fallback para melhor vídeo disponível se o formato combinado não existir
    return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/bestvideo[height<=${height}]/best[height<=${height}]/best`;
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mkv: 'video/x-matroska',
      mp3: 'audio/mpeg',
      m4a: 'audio/mp4',
    };

    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  private executeCommand(
    command: string,
    args: string[],
    timeout: number
  ): Promise<{ code: number; stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args);

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new AppError(
          ErrorCode.DOWNLOAD_TIMEOUT,
          'Download timeout exceeded',
          408
        ));
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        resolve({
          code: code || 0,
          stdout,
          stderr,
        });
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(new AppError(
          ErrorCode.DOWNLOAD_FAILED,
          `Failed to execute yt-dlp: ${error.message}`,
          500
        ));
      });
    });
  }
}

export const ytdlpService = new YtdlpService();
