import { DynamoDB } from 'aws-sdk';
import { default as createTodoLambda } from './handlers/create-todo-handler';
import { ItemService } from './services/todo-service';

const dynamoDbClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });
const itemService = new ItemService(dynamoDbClient); 

export const todoHandler = createTodoLambda(itemService);