import { Handler, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { ITodoService } from '../services/todo-service';
import { ResponseFactory } from '../factories/response-factory';

export default (todoService: ITodoService): Handler<APIGatewayEvent, APIGatewayProxyResult> => {
    return async (event: APIGatewayEvent) => {

        if (!event.pathParameters) {  
            let res = await todoService.readAllTodo();
            return ResponseFactory.generateSuccessResponse(res);
        }

        try {
            let res = await todoService.readTodo(event.pathParameters.id);
            return ResponseFactory.generateSuccessResponse(res);
        } catch (err) {
            return ResponseFactory.generateErrorResponse(err.statusCode, err.message);
        }
    };
}
