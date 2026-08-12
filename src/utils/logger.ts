export enum ErrorCode {
  INVALID_URL = 'INVALID_URL',
  INVALID_QUALITY = 'INVALID_QUALITY',
  RATE_LIMITED = 'RATE_LIMITED',
  DOWNLOAD_TIMEOUT = 'DOWNLOAD_TIMEOUT',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  SERVER_ERROR = 'SERVER_ERROR',
  SSRF_BLOCKED = 'SSRF_BLOCKED',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createErrorResponse(code: ErrorCode, message: string) {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}
