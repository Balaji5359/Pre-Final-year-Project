import json
import boto3

def lambda_handler(event, context):
    try:
        # Parse the incoming request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        # Extract message and sessionId from the request
        message = body.get('message', '').strip()
        session_id = body.get('sessionId', 'default-session')
        
        print(f"Received message: '{message}'")
        print(f"Session ID: {session_id}")
        
        # Validate that message is not empty
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Message cannot be empty'
                })
            }
        
        # Create Bedrock agent runtime client
        bedrock_client = boto3.client('bedrock-agent-runtime', region_name='ap-south-1')
        
        # Invoke the Bedrock agent with frontend sessionId embedded in input
        enhanced_message = f"[FRONTEND_SESSION:{session_id}] {message}"
        
        response = bedrock_client.invoke_agent(
            agentId='O3VBBOAX9N',
            agentAliasId='P7W6BBE2X5',
            sessionId=session_id,
            inputText=enhanced_message
        )
        
        # Process the streaming response
        completion = ""
        for event_chunk in response['completion']:
            if 'chunk' in event_chunk:
                chunk = event_chunk['chunk']
                if 'bytes' in chunk:
                    completion += chunk['bytes'].decode('utf-8')
        
        print(f"Agent response: {completion}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'response': completion,
                'sessionId': session_id
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Internal server error: {str(e)}'
            })
        }