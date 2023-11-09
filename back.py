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


@app.route("/getdata", methods=["GET"])
def get_medical_records():
    records = list(collection.find({}, {"_id": 0}))
    return jsonify(records)

if __name__ == '__main__':
    app.run(debug=True)
