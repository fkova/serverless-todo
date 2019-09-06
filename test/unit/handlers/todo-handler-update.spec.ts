import { default as handler } from '../../../src/handlers/todo-handler-update';
import { ITodoService, TodoService } from '../../../src/services/todo-service';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { SchemaValidatorService } from '../../../src/services/schema-validator-service';
import { DynamoDB } from 'aws-sdk';
import ajv from 'ajv';

const jsonSchemaValidatorService = new SchemaValidatorService(
    new ajv({
        allErrors: true,
        format: 'full'
    }));

let mockedTodoService: ITodoService;

describe.only('Testing create item handler', () => {
    beforeAll(() => {
        jest.spyOn(TodoService.prototype, 'updateTodo').mockImplementation((id) => Promise.resolve({}));  
        mockedTodoService = new TodoService(new DynamoDB.DocumentClient());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('handler called with valid PUT event', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: {
                id: '123'
            },
            body: JSON.stringify({
                todo_title: 'something_else'
            })
        } as unknown as APIGatewayProxyEvent;

        const response = await callLambda(event);

        expect(mockedTodoService.updateTodo).toHaveBeenCalledWith('123', 'something_else');
        expect(mockedTodoService.updateTodo).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('OK');
    });

    test('handler called with PUT event without pathParameters or body should give an error response', async () => {
        const event = {
            httpMethod: 'PUT'
        } as APIGatewayProxyEvent;

        const result = await callLambda(event);

        expect(result).toMatchObject({
            statusCode: 400,
            body: JSON.stringify({
                status: 400,
                message: "Bad Request",
                description: "Missing id!"
            })
        });
    });

    test('handler called with invalid PUT Schema shoult return error 400', async () => {
        const event = {
            httpMethod: 'PUT',
            pathParameters: {
                id: '123'
            },
            body: JSON.stringify({
                todo_title_: 'something_else'
            })
        } as unknown as APIGatewayProxyEvent;

        const response = await callLambda(event);

        expect(response).toMatchObject({
            statusCode: 400,
            body: JSON.stringify({
                status: 400,
                message: "Bad Request",
                description: "The body has 2 validation error(s): data should NOT have additional properties 'todo_title_', data should have required property 'todo_title'."
            })
        });
    });

    test('handler should return Error 500 response if Service call thorws error', async () => {
        jest.spyOn(TodoService.prototype, 'updateTodo').mockImplementation((id) => Promise.reject('error'));
        mockedTodoService = new TodoService(new DynamoDB.DocumentClient());

        const event = {
            httpMethod: 'PUT',
            pathParameters: {
                id: '123'
            },
            body: JSON.stringify({
                todo_title: 'something_else'
            })
        } as unknown as APIGatewayProxyEvent;

        const response = await callLambda(event);
        
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).message).toBe("Internal Server Error");
    });
});

const callLambda = async (event: APIGatewayProxyEvent) => {
    return await handler(mockedTodoService,jsonSchemaValidatorService)(
        event,
        undefined as unknown as Context,
        undefined as unknown as Callback<APIGatewayProxyResult>
    ) as APIGatewayProxyResult;
}