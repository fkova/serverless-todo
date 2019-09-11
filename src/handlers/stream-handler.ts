import { DynamoDBStreamEvent } from 'aws-lambda';
import { ISNSService } from '../services/sns-service';

export default (snsService: ISNSService) => {
    return async (event: DynamoDBStreamEvent) => {
        try {
            await snsService.publishToMyTopic(event);
            return { statusCode: 200, body: 'Message sent' };
        }catch(err){
            return { statusCode: 500, body: JSON.stringify(err) };
        }
    }
}
