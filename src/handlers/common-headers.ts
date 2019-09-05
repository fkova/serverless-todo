import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

export default (): ((handler: Handler<APIGatewayEvent, APIGatewayProxyResult>) => Handler<APIGatewayEvent, APIGatewayProxyResult>) => {
    return (handler) => {
        return async (event, context, callback) => {
            const response = await handler(event, context, callback) as APIGatewayProxyResult;

            response.headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE,OPTIONS'  
            };

            return response;
        };
    };
};