import { default as handler } from '../../../src/handlers/stream-handler';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { ISNSService } from '../../../src/services/sns-service';

const testEventBody: DynamoDBStreamEvent = {
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
    //methods
    let mockPublishToMyTopic: jest.Mock;

    //services
    let mockSnsService: ISNSService;

    beforeEach(() => {
        mockPublishToMyTopic = jest.fn();

        mockSnsService = new (jest.fn<ISNSService, []>(() => ({
            publishToMyTopic: mockPublishToMyTopic,
        })));
    });

    it('should be return statusCode 200 if SNS message sending succesful', async () =>{
        mockPublishToMyTopic.mockResolvedValue('ok');
        const response = await handler(mockSnsService)(testEventBody);

        expect(mockPublishToMyTopic).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("Message sent");
        expect(mockPublishToMyTopic).toBeCalledWith(testEventBody);
    });

    it('should be return statusCode 500 if SNS message sending unsuccesful', async () => {
        mockPublishToMyTopic.mockRejectedValue('any error');
        const response = await handler(mockSnsService)(testEventBody);
        
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toBe("any error");
        expect(mockPublishToMyTopic).toHaveBeenCalledTimes(1);
        expect(mockPublishToMyTopic).toHaveBeenCalledWith(testEventBody);
    });
});