import { MySNSService, ISNSService } from '../../../src/services/sns-service'; 
import { SNS } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';

const testEvent: DynamoDBStreamEvent = {
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

describe('Testing sns service', () => {
    const snsClient = new SNS();
    let mockSnsPublish: jest.SpyInstance;
    let mySnsService: ISNSService;

    beforeEach(() => {
        mySnsService = new MySNSService(snsClient);
        mockSnsPublish = jest.spyOn(snsClient,'publish');
    });

    afterEach(() => {
        mockSnsPublish.mockReset();
    });

    it('should call publish with correct params', async () => {
        mockSnsPublish.mockResolvedValue('oks');

        await mySnsService.publishToMyTopic(testEvent);

        expect(mockSnsPublish).toHaveBeenCalledTimes(1);
    });
})