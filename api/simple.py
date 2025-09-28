def handler(request):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': '{"message": "Simple handler working", "status": "success"}'
    }
