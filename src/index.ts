import ajv from 'ajv';
import { DynamoDB } from 'aws-sdk';
import { default as createTodoLambda } from './handlers/todo-handler-create';
import { default as readTodoLambda } from './handlers/todo-handler-read';
import { default as updateTodoLambda } from './handlers/todo-handler-update';
import { default as deleteTodoLambda } from './handlers/todo-handler-delete';
import { TodoService } from './services/todo-service';
import { SchemaValidatorService } from './services/schema-validator-service';
import commonHeaders from './handlers/common-headers'

const dynamoDbClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });
const todoService = new TodoService(dynamoDbClient); 
const validatorService = new SchemaValidatorService(
    new ajv({
        allErrors: true,
        format: 'full'
    }));

export const createTodo = commonHeaders()(createTodoLambda(todoService, validatorService));
export const readTodo = readTodoLambda(todoService);
export const deleteTodo = deleteTodoLambda(todoService);
export const updateTodo = updateTodoLambda(todoService, validatorService);