import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        // statusCode: status,
        // timestamp: new Date().toISOString(),
        // path: request.url,

        error: "Payload too large",
        message: "File too large customize",    //customizing message for checking valid files uploaded
        statusCode: status,
      });
  }
}