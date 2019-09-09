import {DynamoDBStreamEvent } from 'aws-lambda';
import AWS from 'aws-sdk';

export default () =>{
    return async (event: DynamoDBStreamEvent) => {
        //console.log(JSON.stringify(event));

        var sns = new AWS.SNS();

        const table = event.Records[0].eventSourceARN.split('/')[1];
        const details = JSON.stringify(event.Records[0].dynamodb,null,2);
        const time = new Date(event.Records[0].dynamodb.ApproximateCreationDateTime*1000);
        const type = event.Records[0].eventName;

        var params = {
            Message: `time: ${time} \n details: \n ${details}`,
            Subject: `${type} happened on table ${table}`,
            TopicArn: process.env.SNS_TOPIC_ARN
        };

        try {
            await sns.publish(params).promise();
            return { statusCode: 200, body: 'Message sent' };
        }catch(err){
            return {statusCode: 500, body: JSON.stringify(err)};
        }
    }
}
