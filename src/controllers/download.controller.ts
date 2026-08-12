import { FastifyRequest, FastifyReply } from 'fastify';
import { downloadRequestSchema } from '../schemas/download.schema';
import { downloadService } from '../services/download.service';
import { AppError, ErrorCode, createErrorResponse } from '../utils/logger';

export async function downloadController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Validate request body
    const validationResult = downloadRequestSchema.safeParse(request.body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new AppError(
        ErrorCode.INVALID_URL,
        firstError?.message || 'Invalid request',
        400
      );
    }

    const { url, quality } = validationResult.data;

    // Process download
    const result = await downloadService.processDownload(url, quality);

    return reply
      .header('Content-Type', result.mimeType)
      .header('Content-Disposition', `attachment; filename="${result.filename}"`)
      .send(result.file);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(createErrorResponse(error.code, error.message));
    }

    request.log.error(error);
    return reply.status(500).send(createErrorResponse(ErrorCode.SERVER_ERROR, 'Internal server error'));
  }
}
