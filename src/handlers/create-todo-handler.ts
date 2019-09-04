
export default () => {
    return async (event: any) => {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',

            })
        }
    };
}
