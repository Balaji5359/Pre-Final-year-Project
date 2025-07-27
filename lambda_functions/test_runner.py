import json
import sys
import os

# Add the current directory to Python path to import the Lambda function
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock AWS services for testing
class MockBoto3Client:
    def invoke_agent(self, **kwargs):
        return {
            'completion': [
                {
                    'chunk': {
                        'bytes': b'Great pronunciation! Your speech was clear and well-paced.'
                    }
                }
            ]
        }

class MockDynamoDBTable:
    def __init__(self, table_name):
        self.table_name = table_name
        self.items = {}
    
    def get_item(self, Key):
        session_id = Key['sessionId']
        if session_id in self.items:
            return {'Item': self.items[session_id]}
        return {}
    
    def put_item(self, Item):
        session_id = Item['sessionId']
        self.items[session_id] = Item

class MockDynamoDBResource:
    def Table(self, table_name):
        return MockDynamoDBTable(table_name)

# Mock environment variables
os.environ['BEDROCK_AGENT_ID'] = 'test-agent-id-123'
os.environ['BEDROCK_AGENT_ALIAS_ID'] = 'test-alias-id'

# Mock boto3
import boto3
boto3.client = lambda service: MockBoto3Client()
boto3.resource = lambda service: MockDynamoDBResource()

# Import the Lambda function after mocking
from frontend_integration import lambda_handler

def run_test(test_case):
    """Run a single test case"""
    print(f"\n{'='*50}")
    print(f"Running: {test_case['name']}")
    print(f"{'='*50}")
    
    try:
        # Call the Lambda function
        result = lambda_handler(test_case['event'], {})
        
        print(f"Status Code: {result['statusCode']}")
        
        # Parse response body
        if 'body' in result:
            body = json.loads(result['body'])
            print(f"Response Body: {json.dumps(body, indent=2)}")
            
            # Check expected results
            expected = test_case['expected']
            
            # Check status code
            if result['statusCode'] == expected['statusCode']:
                print("✅ Status code matches expected")
            else:
                print(f"❌ Status code mismatch. Expected: {expected['statusCode']}, Got: {result['statusCode']}")
            
            # Check if response contains expected fields
            body_str = json.dumps(body)
            for expected_field in expected['contains']:
                if expected_field in body_str:
                    print(f"✅ Contains expected field: {expected_field}")
                else:
                    print(f"❌ Missing expected field: {expected_field}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        return False

def main():
    """Run all test cases"""
    print("Starting Lambda Function Test Suite")
    print("="*60)
    
    # Load test cases
    with open('test_cases.json', 'r') as f:
        test_cases = json.load(f)
    
    passed = 0
    failed = 0
    
    for test_case in test_cases:
        if run_test(test_case):
            passed += 1
        else:
            failed += 1
    
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Total Tests: {len(test_cases)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/len(test_cases)*100):.1f}%")

if __name__ == "__main__":
    main()