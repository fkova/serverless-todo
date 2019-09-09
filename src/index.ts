import ajv from 'ajv';
import { DynamoDB } from 'aws-sdk';

import { default as createTodoLambda } from './handlers/todo-handler-create';
import { default as readTodoLambda } from './handlers/todo-handler-read';
import { default as updateTodoLambda } from './handlers/todo-handler-update';
import { default as deleteTodoLambda } from './handlers/todo-handler-delete';
import { default as processDynamoStreamLamnbda } from './handlers/process-dynamodb-stream';

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
export const readTodo = commonHeaders()(readTodoLambda(todoService));
export const deleteTodo = commonHeaders()(deleteTodoLambda(todoService));
export const updateTodo = commonHeaders()(updateTodoLambda(todoService, validatorService));
export const processDynamoStream = processDynamoStreamLamnbda();