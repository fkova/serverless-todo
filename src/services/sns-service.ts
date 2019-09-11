import { DynamoDBStreamEvent } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';

export interface ISNSService {
    publishToMyTopic(event: DynamoDBStreamEvent): Promise<any>;
}

export class MySNSService implements ISNSService{
    constructor(private snsClient: SNS) { };
    
    async publishToMyTopic(event: DynamoDBStreamEvent): Promise<void> {

        for (const record of event.Records){
            const oldValue = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
            const newValue = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
            const table = record.eventSourceARN.split('/')[1];
            const time = new Date(record.dynamodb.ApproximateCreationDateTime * 1000);
            const type = record.eventName;

            const params = {
                Message: `time: ${time} \nOLD: ${JSON.stringify(oldValue,null,2)} \nNEW: ${JSON.stringify(newValue,null,2)}`,
                Subject: `${type} happened on table ${table}`,
                TopicArn: process.env.SNS_TOPIC_ARN
            };

            try{
                await this.snsClient.publish(params).promise();
            }catch(err){
                console.log(err);
            }  
        }
    }
}