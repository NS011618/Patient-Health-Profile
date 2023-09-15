from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)

CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://ashishgolla2003:NS011618@cluster0.ophbpqo.mongodb.net/patient'
mongo = PyMongo(app)
users_collection = mongo.db.users



@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']
        confirmPassword = data['confirmPassword']
        role = data['role']  # Get the selected role

        if users_collection.find_one({'$or': [{'username': username}]}):
            return jsonify({'status': False, 'msg': 'Username already exists'}), 400

        if password != confirmPassword:
            return jsonify({'status': False, 'msg': 'Password and confirm password do not match'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_id = users_collection.insert_one({'username': username, 'password': hashed_password, 'role': role}).inserted_id

        return jsonify({'status': True, 'msg': 'Registered successfully', 'user_id': str(user_id)}), 201

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']
        role = data['role']  # Get the selected role

        user = users_collection.find_one({'username': username, 'role': role})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'status': True, 'msg': 'Login successful'}), 200
        else:
            return jsonify({'status': False, 'msg': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'status': False, 'msg': str(e)}), 500

collection_name = 'patient_data'
collection = mongo.db[collection_name]
@app.route('/summarize', methods=['POST'])
def receive_and_save_data():
    try:
        data = request.get_json()  # Get the JSON data from the request
        
        if not data:
            return jsonify({'message': 'No data received'}), 400

        # Ensure that "Sno" is unique and serves as the primary key
        for record in data:
            if "Sno" not in record:
                return jsonify({'message': 'Each record must have a "Sno" field'}), 400

            # Check if a record with the same "Sno" already exists in the database
            existing_record = collection.find_one({"Sno": record["Sno"]})
            if existing_record:
                return jsonify({'message': f'Duplicate record with Sno {record["Sno"]} exists'}), 400

        # Insert the received data into the MongoDB collection
        result = collection.insert_many(data)
        print(result.inserted_ids)

        return jsonify({'message': 'Data received and saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

import torch
from transformers import BertTokenizer, BertForMaskedLM

# Load ClinicalBERT model and tokenizer


# Define a function to generate medical case presentations
def generate_medical_case_presentation(info_dict, max_length=512):
    structured_info = ""
    for section, content in info_dict.items():
        structured_info += f"{section}:\n{content}\n"

    input_text = structured_info


    model_name = "emilyalsentzer/Bio_ClinicalBERT"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForMaskedLM.from_pretrained(model_name)

    # Tokenize the input text
    input_ids = tokenizer.encode(input_text, return_tensors="pt", truncation=True)

    # Split input text into smaller segments if it exceeds max_length
    if len(input_ids[0]) > max_length:
        segments = []
        current_segment = []
        for token_id in input_ids[0]:
            current_segment.append(token_id)
            if len(current_segment) >= max_length - 2:  # Account for [CLS] and [SEP] tokens
                segments.append(current_segment)
                current_segment = [input_ids[0][0]]  # Start a new segment with [CLS] token

        # Generate text for each segment
        generated_text = ""
        for segment in segments:
            with torch.no_grad():
                output = model.generate(torch.tensor(segment).unsqueeze(0), max_length=200, num_return_sequences=1, no_repeat_ngram_size=2)

            generated_text += tokenizer.decode(output[0], skip_special_tokens=True)

        return generated_text

    # If the input fits within the max_length, generate text directly
    with torch.no_grad():
        output = model.generate(input_ids, max_length=200, num_return_sequences=1, no_repeat_ngram_size=2)

    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    return generated_text

def generate_summerization_clinical_bert(info_dict):
  res = generate_medical_case_presentation(info_dict)
  return res

@app.route('/summary', methods=['POST'])
def summarize():

    try:
        # Get the JSON data from the POST request
        request_data = request.json
        # Extract the "text" value from the JSON data
        text_data = request_data.get('text', '')
        print(text_data)
        res = generate_summerization_clinical_bert(text_data)
        print(res)
        # Perform summarization or any other processing on the text_data here
        # For this example, let's just return the extracted text as a response
        return jsonify({'result': res}), 200

    except Exception as e:
        return jsonify({'error': 'Invalid JSON format'}), 400

@app.route("/getdata", methods=["GET"])
def get_medical_records():
    records = list(collection.find({}, {"_id": 0}))
    return jsonify(records)

if __name__ == '__main__':
    app.run(debug=True)
