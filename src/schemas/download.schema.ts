import { z } from 'zod';

export const downloadRequestSchema = z.object({
  url: z
    .string()
    .url('Invalid URL format')
    .max(2048, 'URL too long')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          // Block localhost and private networks
          const hostname = parsed.hostname.toLowerCase();
          
          const blockedHosts = [
            'localhost',
            '127.0.0.1',
            '::1',
            '0.0.0.0',
          ];
          
          if (blockedHosts.includes(hostname)) {
            return false;
          }
          
          // Block private IP ranges
          if (hostname.startsWith('192.168.') ||
              hostname.startsWith('10.') ||
              hostname.startsWith('172.')) {
            return false;
          }
          
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid or blocked URL' }
    ),
  quality: z.enum(['360', '480', '720', '1080', '1440', '2160', 'mp3'], {
    message: 'Invalid quality. Must be 360, 480, 720, 1080, 1440, 2160, or mp3',
  }),
});

export type DownloadRequest = z.infer<typeof downloadRequestSchema>;

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
