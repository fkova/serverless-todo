import { Handler, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { ITodoService } from '../services/todo-service';
import { ResponseFactory } from '../factories/response-factory';
import { ISchemaValidatorService } from '../services/schema-validator-service';
import TodoSchema from '../schemas/genericTodoSchema.schema.json';

export default (todoService: ITodoService, validator: ISchemaValidatorService): Handler<APIGatewayEvent, APIGatewayProxyResult> => {
    return async (event: APIGatewayEvent) => {
        if (!event.pathParameters) {
            return ResponseFactory.generateBadRequestResponse('Missing id!');
        }
        let body = JSON.parse(event.body || '{}');

        let validationError = validator.validate(body, TodoSchema);

        if (validationError) {
            return ResponseFactory.generateErrorResponse(400, validationError);
        }

        try {
            let res = await todoService.updateTodo(event.pathParameters.id, body.todo_title);
            return ResponseFactory.generateSuccessResponse(res);
        } catch (err) {
            return ResponseFactory.generateErrorResponse(err.statusCode, err.message);
        }
    };
}
