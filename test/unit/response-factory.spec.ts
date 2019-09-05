import { STATUS_CODES } from 'http';
import { ResponseFactory } from '../../src/factories/response-factory';

describe('Testing response factory', () => {
    it('should return with success response without additional data', () => {
        const statusCode = 200;
        const expectedResult = {
            statusCode: statusCode,
            body: JSON.stringify({
                status: statusCode,
                message: STATUS_CODES[statusCode]
            })
        };

        const result = ResponseFactory.generateSuccessResponse({});
        expect(result).toEqual(expectedResult);
    });

    it('should return with success response with additional data', () => {
        const statusCode = 200;
        const expectedResult = {
            statusCode: statusCode,
            body: JSON.stringify({
                item_id: '1',
                item_name: 'something',
                status: statusCode,
                message: STATUS_CODES[statusCode]
            })
        };

        const result = ResponseFactory.generateSuccessResponse({ item_id: '1', item_name: 'something' });
        expect(result).toEqual(expectedResult);
    });

    it('should return with error response with the given status code', () => {
        const statusCode = 403;
        const message = 'Error!'
        const expectedResult = {
            statusCode: statusCode,
            body: JSON.stringify({
                status: statusCode,
                message: STATUS_CODES[statusCode],
                description: message
            })
        };

        const result = ResponseFactory.generateErrorResponse(statusCode, message);
        expect(result).toEqual(expectedResult);
    });

    it('should return with error response with status code 500 by default', () => {
        const statusCode = 500;
        const message = 'Error!'
        const expectedResult = {
            statusCode: statusCode,
            body: JSON.stringify({
                status: statusCode,
                message: STATUS_CODES[statusCode],
                description: message
            })
        };

        const result = ResponseFactory.generateErrorResponse(0, message);
        expect(result).toEqual(expectedResult);
    });

    it('should return with bad request response', () => {
        const statusCode = 400;
        const message = 'Error!'
        const expectedResult = {
            statusCode: statusCode,
            body: JSON.stringify({
                status: statusCode,
                message: STATUS_CODES[statusCode],
                description: message
            })
        };

        const result = ResponseFactory.generateBadRequestResponse(message);
        expect(result).toEqual(expectedResult);
    });
});