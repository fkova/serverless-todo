import { default as handler } from '../../../src/handlers/todo-handler-delete';
import { ITodoService, TodoService } from '../../../src/services/todo-service';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
//import {} from 'jest-date-mock' - minek?
let mockTodoService: ITodoService;

describe.only('Testing create item handler', () => {
    
    //let mockDeleteTodo: jest.Mock;

    beforeAll(() => {
        /*mockDeleteTodo = jest.fn();

        const mockTodoService = new (jest.fn<Partial<ITodoService>, undefined[]>(() => ({
            deleteTodo: mockDeleteTodo,
        })))() as ITodoService;*/

        jest.spyOn(TodoService.prototype, 'deleteTodo').mockImplementation((id) => Promise.resolve({}));  
        mockTodoService = new TodoService(new DynamoDB.DocumentClient());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('handler called with valid DELETE event', async () => {
        const event = {
            httpMethod: 'DELETE',
            pathParameters: {
                id: '123'
            }
        } as unknown as APIGatewayProxyEvent;

        const response = await callLambda(event);
        
        expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('123');
        expect(mockTodoService.deleteTodo).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).message).toBe('OK');
    });

    test('handler called with DELETE event without pathParameters should give an error response', async () => {
        const event = {
            httpMethod: 'DELETE'
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
});

const callLambda = async (event: APIGatewayProxyEvent) => {
    return await handler(mockTodoService)(
        event,
        undefined as unknown as Context,
        undefined as unknown as Callback<APIGatewayProxyResult>
    ) as APIGatewayProxyResult;
}