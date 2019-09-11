import ajv from 'ajv';
import AWS from 'aws-sdk';

import { default as createTodoLambda } from './handlers/todo-handler-create';
import { default as readTodoLambda } from './handlers/todo-handler-read';
import { default as updateTodoLambda } from './handlers/todo-handler-update';
import { default as deleteTodoLambda } from './handlers/todo-handler-delete';
import { default as streamHandlerLambda } from './handlers/stream-handler';

import { TodoService } from './services/todo-service';
import { MySNSService } from './services/sns-service';
import { SchemaValidatorService } from './services/schema-validator-service';

import commonHeaders from './handlers/common-headers'

AWS.config.update({region: "us-east-2"});

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const SNSClient = new AWS.SNS();

const todoService = new TodoService(dynamoDbClient); 
const snsService = new MySNSService(SNSClient); 

const validatorService = new SchemaValidatorService(
    new ajv({
        allErrors: true,
        format: 'full'
    })
);

export const createTodo = commonHeaders()(createTodoLambda(todoService, validatorService));
export const readTodo = commonHeaders()(readTodoLambda(todoService));
export const deleteTodo = commonHeaders()(deleteTodoLambda(todoService));
export const updateTodo = commonHeaders()(updateTodoLambda(todoService, validatorService));
export const streamHandler = streamHandlerLambda(snsService);