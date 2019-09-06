import { TodoService } from '../../src/services/todo-service';
import { DynamoDB } from 'aws-sdk';
import { TABLE_NAME } from '../../src/constants';

const dc = new DynamoDB.DocumentClient();
const mockDbPutMethod: jest.SpyInstance = jest.spyOn(dc, 'put');
const mockDbGetMethod: jest.SpyInstance = jest.spyOn(dc, 'get');
const mockDbUpdateMethod: jest.SpyInstance = jest.spyOn(dc, 'update');
const mockDbDeleteMethod: jest.SpyInstance = jest.spyOn(dc, 'delete');
const todoService = new TodoService(dc);

describe('Testing item service', () => {

    it('should call createTodo with correct params', async () => {
        const name = 'valami';

        mockDbPutMethod.mockReturnValue({
            promise() {
                return Promise.resolve({
                    "tudo_title": name
                });
            }
        });

        const result = await todoService.createTodo(name);

        expect(result).toMatchObject({
            "todo_title": name
        });
    });

    it('should call readTodo with correct params and return mocked values', async () => {
        const id = '1';
        const name = 'anyItem';
        const returnValues = {
            todo_id: id,
            todo_title: name
        }

        mockDbGetMethod.mockReturnValue({
            promise() {
                return Promise.resolve({
                    Item: returnValues
                });
            }
        });

        let result = await todoService.readTodo(id);

        expect(result).toEqual(returnValues);
        expect(mockDbGetMethod).toHaveBeenCalledWith({
            TableName: TABLE_NAME,
            Key: {
                todo_id: id,
            }
        });
    });

    it('should call updateTodo with correct params', async () => {
        const id = '1';
        const title = 'akarmi'

        mockDbUpdateMethod.mockReturnValue({
            promise() {
                return Promise.resolve({});
            }
        });

        await todoService.updateTodo(id, title);

        expect(mockDbUpdateMethod).toHaveBeenCalledWith({
            TableName: TABLE_NAME,
            Key: {
                todo_id: id
            },
            UpdateExpression: 'set todo_title = :v',
            ExpressionAttributeValues: {
                ':v': title
            },
            ReturnValues: 'UPDATED_NEW'
        });
    });

    it('should call deleteTodo with correct params', async () => {
        const id = '1';

        mockDbDeleteMethod.mockReturnValue({
            promise() {
                return Promise.resolve({});
            }
        });

        await todoService.deleteTodo(id);

        expect(mockDbDeleteMethod).toHaveBeenCalledWith({
            TableName: TABLE_NAME,
            Key: {
                todo_id: id,
            }
        });
    });
});