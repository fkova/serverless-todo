import { default as handler } from '../../../src/handlers/todo-handler-read';
import { ITodoService, TodoService } from '../../../src/services/todo-service';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
let mockedTodoService: ITodoService;

describe.only('Testing create item handler', () => {
    beforeAll(() => {
        jest.spyOn(TodoService.prototype, 'readTodo').mockImplementation((id) => Promise.resolve({
            todo_id: id,
            todo_title: 'anything'
        }));  

        jest.spyOn(TodoService.prototype, 'readAllTodo').mockImplementation(() => Promise.resolve({
            "Items": [
                {
                    "todo_id": "2",
                    "todo_title": "más"
                },
                {
                    "todo_id": "1",
                    "todo_title": "valami"
                }
            ],
        }));  

        mockedTodoService = new TodoService(new DynamoDB.DocumentClient());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('handler called with valid GET event', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                id: '123'
            }
        } as unknown as APIGatewayProxyEvent;

        const response = await callLambda(event);

        expect(mockedTodoService.readTodo).toHaveBeenCalledWith('123');
        expect(mockedTodoService.readTodo).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).todo_id).toBe('123');
    });

    test('handler called with GET event without pathParameters should give back every Todo', async () => {
        const event = {
            httpMethod: 'GET'
        } as APIGatewayProxyEvent;

        const result = await callLambda(event);
        
        expect(JSON.parse(result.body)).toMatchObject({
            status: 200,
            message: "OK",
        });
        expect(JSON.parse(result.body).Items).toBeInstanceOf(Array);  
    });
    
});

const callLambda = async (event: APIGatewayProxyEvent) => {
    return await handler(mockedTodoService)(
        event,
        undefined as unknown as Context,
        undefined as unknown as Callback<APIGatewayProxyResult>
    ) as APIGatewayProxyResult;
}