import { default as handler } from '../../../src/handlers/stream-handler';
import AWS from 'aws-sdk';
import { DynamoDBStreamEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MySNSService, ISNSService } from '../../../src/services/sns-service';

let mockedSNSService: ISNSService;
let mockPublishToMyTopic = jest.spyOn(MySNSService.prototype, "publishToMyTopic");
let testEventBody = {
    "Records": [
        {
            "eventName": "INSERT",
            "dynamodb": {
                "ApproximateCreationDateTime": 1568017228,
                "Keys": {
                    "todo_id": {
                        "S": "adedd820-d2da-11e9-bc4a-a7b35501e066"
                    }
                },
                "NewImage": {
                    "todo_title": {
                        "S": "tesztAdd"
                    },
                    "todo_id": {
                        "S": "adedd820-d2da-11e9-bc4a-a7b35501e066"
                    }
                }
            },
            "eventSourceARN": "arn:aws:dynamodb:us-east-2:101588535247:table/myTodoTable/stream/2019-09-09T08:18:27.924"
        }
    ]
}

describe.only('Testing dynamodb event processor lambda', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be return statusCode 200 if SNS message sending succesful', async () =>{
        mockPublishToMyTopic.mockImplementation(() => Promise.resolve());

        mockedSNSService = new MySNSService(new AWS.SNS());

        const result = await callLambda(testEventBody);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe("Message sent");
        expect(mockedSNSService.publishToMyTopic).toHaveBeenCalledTimes(1);
        expect(mockedSNSService.publishToMyTopic).toHaveBeenCalledWith(testEventBody);
    });

    it('should be return statusCode 500 if SNS message sending unsuccesful', async () => {
        
        jest.spyOn(MySNSService.prototype, "publishToMyTopic").mockImplementation(() => 
        {
            console.log('whut');
            return Promise.reject();
        }
        );
        mockedSNSService = new MySNSService(new AWS.SNS());
        const result = await callLambda(testEventBody);
        
        expect(result.statusCode).toBe(500);
        expect(result.body).toBeUndefined();
        expect(mockedSNSService.publishToMyTopic).toHaveBeenCalledTimes(1);
        expect(mockedSNSService.publishToMyTopic).toHaveBeenCalledWith(testEventBody);
    });

});

const callLambda = async (event: any) => {
    return await handler(mockedSNSService)(event) as APIGatewayProxyResult;
}