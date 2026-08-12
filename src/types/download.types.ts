export interface DownloadProgress {
  id: string;
  url: string;
  quality: string;
  status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed';
  progress: number;
  filename?: string;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

export type DownloadStatus = DownloadProgress['status'];

export interface DownloadOptions {
  url: string;
  quality: string;
  timeout: number;
  maxSizeMB: number;
}
