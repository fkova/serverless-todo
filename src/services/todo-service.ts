import { DocumentClient } from 'aws-sdk/clients/dynamodb';


export class TodoService {
    constructor(private dynamoDbClient: DocumentClient) { };

    async createItem(name: String): Promise<any> {
        const new_id = uuid();
        let params = {
            TableName: tableName,
            Item: {
                item_id: new_id,
                item_name: name
            },
            ReturnValues: "ALL_OLD"
        };

        return await this.dynamoDbClient.put(params).promise().then(() => params.Item);
    }
}