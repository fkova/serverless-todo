import { default as handler} from '../../../src/handlers/todo-handler-create';
import { ITodoService, TodoService } from '../../../src/services/todo-service';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { SchemaValidatorService } from '../../../src/services/schema-validator-service';
import { DynamoDB } from 'aws-sdk';
import ajv from 'ajv';
let mockedTodoService: ITodoService;

const jsonSchemaValidatorService = new SchemaValidatorService(
    new ajv({
        allErrors: true,
        format: 'full'
    }));

describe.only('Testing create item handler', () => {
    beforeAll(()=>{
        jest.spyOn(TodoService.prototype, 'createTodo').mockImplementation(() => Promise.resolve()); 
        mockedTodoService = new TodoService(new DynamoDB.DocumentClient());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('handler called with valid POST event', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                todo_title: "alma"
            })
        } as APIGatewayProxyEvent;

        const response = await callLambda(event);

        expect(mockedTodoService.createTodo).toHaveBeenCalledWith('alma');
        expect(mockedTodoService.createTodo).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
    });


    test('handler called with POST event without body should give an error response', async () => {
        const event = {
            httpMethod: 'POST'
        } as APIGatewayProxyEvent;

        const result = await callLambda(event);

        expect(result).toMatchObject({
            statusCode: 400,
            body: JSON.stringify({
                status: 400,
                message: "Bad Request",
                description: "The body has 1 validation error(s): data should have required property 'todo_title'."
            })
        });
    });
});

const callLambda = async (event: APIGatewayProxyEvent) => {
    return await handler(mockedTodoService, jsonSchemaValidatorService)(
        event,
        undefined as unknown as Context,
        undefined as unknown as Callback<APIGatewayProxyResult>
    ) as APIGatewayProxyResult;
}