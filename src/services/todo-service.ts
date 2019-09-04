import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v1 as uuid } from 'uuid';
import {TABLE_NAME} from '../constants';

export interface ITodoService {
    createTodo(title: string): Promise<any>;
    readTodo(id: string): Promise<any>;
    updateTodo(id: string, title: string): Promise<any>;
    deleteTodo(id: string): Promise<any>;
}
export class TodoService {
    constructor(private dynamoDbClient: DocumentClient) { };

    async createTodo(title: string): Promise<any> {
        const new_id = uuid();

        let params = {
            TableName: TABLE_NAME,
            Item: {
                todo_id: new_id,
                todo_title: title
            }
        };

        return await this.dynamoDbClient.put(params).promise().then(() => params.Item);
    }

    async readTodo(id: string): Promise<any> {
        let params = {
            TableName: TABLE_NAME,
            Key: {
                todo_id: id
            }
        };

        return (await this.dynamoDbClient.get(params).promise()).Item
    }

    async updateTodo(id: string, title: string): Promise<any> {
        let params = {
            TableName: TABLE_NAME,
            Key: {
                todo_id: id
            },
            UpdateExpression: 'set todo_title = :v',
            ExpressionAttributeValues: {
                ':v': title
            },
            ReturnValues: 'UPDATED_NEW'
        };

        return await this.dynamoDbClient.update(params).promise()
    }

    async deleteTodo(id: string): Promise<any> {
        let params = {
            TableName: TABLE_NAME,
            Key: {
                todo_id: id
            }
        };

        return await this.dynamoDbClient.delete(params).promise()
    }
}