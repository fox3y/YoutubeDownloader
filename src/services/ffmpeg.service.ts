import { spawn } from 'child_process';
import { AppError, ErrorCode } from '../utils/logger';
import { env } from '../config/env';

class FfmpegService {
  async convertToMp3(inputPath: string, outputPath: string): Promise<void> {
    const args = [
      '-i',
      inputPath,
      '-vn',
      '-acodec',
      'libmp3lame',
      '-ab',
      '192k',
      '-ar',
      '44100',
      '-y',
      outputPath,
    ];

    await this.executeCommand(env.FFMPEG_PATH, args, 300000); // 5 minutes
  }

  async mergeAudioVideo(
    videoPath: string,
    audioPath: string,
    outputPath: string
  ): Promise<void> {
    const args = [
      '-i',
      videoPath,
      '-i',
      audioPath,
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-y',
      outputPath,
    ];

    await this.executeCommand(env.FFMPEG_PATH, args, 300000); // 5 minutes
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
          'FFmpeg processing timeout exceeded',
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
          `Failed to execute FFmpeg: ${error.message}`,
          500
        ));
      });
    });
  }
}

export const ffmpegService = new FfmpegService();
