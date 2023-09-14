
#pip install -q google-generativeai

import pprint
import google.generativeai as palm

palm.configure(api_key='AIzaSyAVURYPU2blnlMeO4pVbKmMofy87FTkV5Q')

models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
models[0].name
model = models[0].name



from flask import Flask, jsonify, request


port_no = 9000
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)

CORS(app)

@app.route('/')
def hello():
  res = {"hello":"hi there api is working "}
  return res,200
    # return jsonify(res), 200

@app.route('/summarize', methods=['POST'])
def fun():
  prompt = "summarize the below point wise"
  try:
    # Get the JSON data from the POST request
        request_data = request.json
        # Extract the "text" value from the JSON data
        text_data = request_data.get('text', '')
        # print(text_data)
        prompt = prompt+text_data
        completion = palm.generate_text(
            model=model,
            prompt=prompt,
            temperature=0,
            # The maximum length of the response
            max_output_tokens=800,
        )

        print(completion.result)


        return jsonify({'sucess': completion.result}), 200
  except Exception as e:
        return jsonify({'error': 'Invalid JSON format'}), 400

app.run(port = port_no)