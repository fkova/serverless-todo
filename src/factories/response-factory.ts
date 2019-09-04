import { STATUS_CODES } from 'http';
import { APIGatewayProxyResult } from 'aws-lambda';

type SuccessResponseData = {
    item_id?: string,
    item_name?: string
}

export class ResponseFactory {
    static generateSuccessResponse(data: SuccessResponseData): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: JSON.stringify({
                ...data,
                status: 200,
                message: STATUS_CODES[200]
            })
        }
    }

    static generateErrorResponse(statusCode: number, errorMessage: string): APIGatewayProxyResult {
        return {
            statusCode: statusCode || 500,
            body: JSON.stringify({
                status: statusCode || 500,
                message: STATUS_CODES[statusCode || 500],
                description: errorMessage
            })
        }
    }

    static generateBadRequestResponse(errorMessage: string): APIGatewayProxyResult {
        return {
            statusCode: 400,
            body: JSON.stringify({
                status: 400,
                message: STATUS_CODES[400],
                description: errorMessage
            })
        }
    }
}