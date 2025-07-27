import json
import boto3
import datetime
import random
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
FEEDBACK_TABLE_NAME = 'PronunciationFeedback'

ALL_SENTENCES = [
    'The quick brown fox jumps over the lazy dog.',
    'A stitch in time saves nine.',
    'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    'Pack my box with five dozen liquor jugs.',
    'The five vines on the fence face each other.',
    'She sells seashells by the seashore.',
    'Peter Piper picked a peck of pickled peppers.',
    'Red leather, yellow leather.',
    'Unique New York, unique New York.',
    'Toy boat, toy boat, toy boat.',
    'Six sick slick slim sycamore saplings.',
    'The thirty-three thieves thought that they thrilled the throne.',
    'Can you can a can as a canner can can a can?',
    'I saw Susie sitting in a shoeshine shop.',
    'How can a clam cram in a clean cream can?',
    'Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair.',
    'Betty Botter bought some butter.',
    'A proper copper coffee pot.',
    'Fresh fried fish, fish fresh fried.',
    'Good blood, bad blood, good blood, bad blood.'
]

def greet_student_logic(event):
    """Handles the initial greeting for the student."""
    greeting_message = "Hello! To start the pronunciation test, please say 'yes'."
    return _create_bedrock_response(event, greeting_message)

def start_pronunciation_test_logic(event):
    """Starts the pronunciation test with randomly selected sentences."""
    session_id = event.get('sessionId', 'unknown-session')
    
    # Select 5 random sentences for this session
    selected_sentences = random.sample(ALL_SENTENCES, 5)
    
    first_sentence = selected_sentences[0]
    response_message = f"Great! Please repeat the following sentence: '{first_sentence}'"
    
    # Store session state with selected sentences
    store_session_state(session_id, 0, first_sentence, selected_sentences)
    
    return _create_bedrock_response(event, response_message)

def evaluate_pronunciation_logic(event):
    """Evaluates pronunciation and provides next sentence or final feedback."""
    spoken_text = None
    session_id = event.get('sessionId', 'unknown-session')
    
    # Extract spoken text from parameters
    if 'requestBody' in event and 'content' in event['requestBody'] and 'application/json' in event['requestBody']['content'] and 'properties' in event['requestBody']['content']['application/json']:
        for prop in event['requestBody']['content']['application/json']['properties']:
            if prop.get('name') == 'spokenText':
                spoken_text = prop.get('value')
                break

    if not spoken_text:
        return _create_bedrock_response(event, "Please provide some text to evaluate.", http_status_code=400)
    
    # Get current session state
    session_data = get_session_data(session_id)
    current_index = session_data.get('currentIndex', 0)
    selected_sentences = session_data.get('selectedSentences', ALL_SENTENCES[:5])
    
    expected_sentence = selected_sentences[current_index]
    
    # Evaluate pronunciation
    mispronounced = find_mispronunciations(expected_sentence, spoken_text)
    
    # Store pronunciation attempt
    store_pronunciation_attempt(session_id, expected_sentence, spoken_text, mispronounced)
    
    # Check if this is the last sentence
    next_index = current_index + 1
    if next_index >= 5:  # Always 5 sentences per session
        # Generate final feedback
        return generate_final_feedback(session_id, event)
    
    # Continue with next sentence
    next_sentence = selected_sentences[next_index]
    store_session_state(session_id, next_index, next_sentence, selected_sentences)
    
    # Generate feedback for current attempt
    if not mispronounced:
        feedback = f"Excellent! Now, please repeat this sentence: '{next_sentence}'"
    elif len(mispronounced) == 1:
        feedback = f"Thank you! There was a minor mispronunciation in '{mispronounced[0]}'. Now, please repeat this sentence: '{next_sentence}'"
    else:
        feedback = f"Great effort! There were minor mispronunciations in some words. Now, please repeat this sentence: '{next_sentence}'"
    
    return _create_bedrock_response(event, feedback)

def find_mispronunciations(expected_sentence, spoken_text):
    """Find mispronounced words by comparing expected vs spoken text."""
    expected_words = expected_sentence.lower().replace('.', '').replace(',', '').replace('?', '').split()
    spoken_words = spoken_text.lower().replace('.', '').replace(',', '').replace('?', '').split()
    
    mispronounced = []
    
    # Simple word-by-word comparison
    for i, expected_word in enumerate(expected_words):
        if i < len(spoken_words):
            if expected_word != spoken_words[i]:
                mispronounced.append(expected_word)
        else:
            mispronounced.append(expected_word)  # Missing word
    
    return mispronounced

def get_session_data(session_id):
    """Get complete session data."""
    try:
        table = dynamodb.Table(FEEDBACK_TABLE_NAME)
        response = table.get_item(Key={'sessionId': session_id})
        
        if 'Item' in response:
            return response['Item']
        return {}
    except:
        return {}

def store_session_state(session_id, current_index, current_sentence, selected_sentences=None):
    """Store current session state."""
    try:
        table = dynamodb.Table(FEEDBACK_TABLE_NAME)
        
        # Get existing session or create new one
        response = table.get_item(Key={'sessionId': session_id})
        
        if 'Item' in response:
            session_data = response['Item']
        else:
            session_data = {
                'sessionId': session_id,
                'timestamp': str(datetime.datetime.now()),
                'attempts': []
            }
        
        session_data['currentIndex'] = current_index
        session_data['currentSentence'] = current_sentence
        if selected_sentences:
            session_data['selectedSentences'] = selected_sentences
        session_data['lastUpdated'] = str(datetime.datetime.now())
        
        table.put_item(Item=session_data)
    except Exception as e:
        print(f"Error storing session state: {e}")

def store_pronunciation_attempt(session_id, expected_sentence, spoken_text, mispronounced):
    """Store pronunciation attempt in DynamoDB."""
    try:
        table = dynamodb.Table(FEEDBACK_TABLE_NAME)
        
        # Get existing session or create new one
        response = table.get_item(Key={'sessionId': session_id})
        
        if 'Item' in response:
            session_data = response['Item']
        else:
            session_data = {
                'sessionId': session_id,
                'timestamp': str(datetime.datetime.now()),
                'attempts': []
            }
        
        # Add new attempt
        attempt = {
            'expected_sentence': expected_sentence,
            'spoken_text': spoken_text,
            'mispronounced': mispronounced,
            'timestamp': str(datetime.datetime.now())
        }
        
        if 'attempts' not in session_data:
            session_data['attempts'] = []
        
        session_data['attempts'].append(attempt)
        session_data['lastUpdated'] = str(datetime.datetime.now())
        
        table.put_item(Item=session_data)
        print(f"Pronunciation attempt stored for session: {session_id}")
        
    except Exception as e:
        print(f"Error storing pronunciation attempt: {e}")

def generate_final_feedback(session_id, event):
    """Generate final feedback after all sentences are completed."""
    try:
        table = dynamodb.Table(FEEDBACK_TABLE_NAME)
        response = table.get_item(Key={'sessionId': session_id})
        
        if 'Item' not in response:
            return _create_bedrock_response(event, "No pronunciation data found for this session.")
        
        session_data = response['Item']
        attempts = session_data.get('attempts', [])
        
        if not attempts:
            return _create_bedrock_response(event, "No pronunciation attempts recorded.")
        
        # Calculate overall score
        total_words = sum(len(attempt['expected_sentence'].split()) for attempt in attempts)
        total_mispronounced = sum(len(attempt['mispronounced']) for attempt in attempts)
        correct_words = total_words - total_mispronounced
        
        score = round((correct_words / total_words) * 10) if total_words > 0 else 0
        
        # Generate performance assessment
        if score >= 9:
            performance = "You showed excellent pronunciation skills!"
            fluency = "Excellent"
        elif score >= 7:
            performance = "You showed good pronunciation skills with minor areas for improvement."
            fluency = "Good"
        elif score >= 5:
            performance = "You showed fair pronunciation with room for improvement."
            fluency = "Fair"
        else:
            performance = "You need significant improvement in pronunciation."
            fluency = "Needs improvement"
        
        # Generate score description
        if total_mispronounced == 0:
            score_text = f"{score}/10 (Perfect pronunciation)"
        elif total_mispronounced <= 3:
            score_text = f"{score}/10 (Minor mispronunciations in some words)"
        else:
            score_text = f"{score}/10 (Multiple mispronunciations detected)"
        
        feedback_message = f"""Thank you for completing the test. Here is your final feedback:

Pronunciation Score: {score_text}
Fluency Assessment: {fluency} (Minor issues with word pronunciation did not significantly impact fluency)
Overall Performance: {performance} Would you like to have another session?"""
        
        return _create_bedrock_response(event, feedback_message)
        
    except Exception as e:
        print(f"Error generating final feedback: {e}")
        return _create_bedrock_response(event, "Error generating feedback. Please try again.")

def reset_session_logic(event):
    """Resets session for a new pronunciation test."""
    session_id = event.get('sessionId', 'unknown-session')
    
    # Clear previous session data
    try:
        table = dynamodb.Table(FEEDBACK_TABLE_NAME)
        table.delete_item(Key={'sessionId': session_id})
    except Exception as e:
        print(f"Error clearing session: {e}")
    
    # Start new test with new random sentences
    return start_pronunciation_test_logic(event)

def _create_bedrock_response(event, message_body, http_status_code=200, parameters=None):
    response_body = {
        "TEXT": {
            "body": str(message_body)
        }
    }

    agent_response = {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event.get("actionGroup", "pronunciation-test-actions"),
            "apiPath": event.get("apiPath", "/unknown"),
            "httpMethod": "POST",
            "httpStatusCode": http_status_code,
            "responseBody": response_body
        }
    }
    
    if parameters:
        agent_response["response"]["parameters"] = parameters
    
    return agent_response

def lambda_handler(event, context):
    try:
        print(f"Received event: {json.dumps(event, indent=2)}")
        
        # Handle function-based action groups
        function_name = event.get('function', '')
        if function_name == 'greet_student_logic':
            return greet_student_logic(event)
        elif function_name == 'start_pronunciation_test_logic':
            return start_pronunciation_test_logic(event)
        elif function_name == 'evaluate_pronunciation_logic':
            return evaluate_pronunciation_logic(event)
        elif function_name == 'reset_session_logic':
            return reset_session_logic(event)
        else:
            # Default to greeting
            return greet_student_logic(event)
            
    except Exception as e:
        print(f"Lambda error: {str(e)}")
        return _create_bedrock_response(event, "Service temporarily unavailable", http_status_code=500)