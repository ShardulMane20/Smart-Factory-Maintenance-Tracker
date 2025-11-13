from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and scaler
MODEL_PATH = 'model.pkl'
SCALER_PATH = 'scaler.pkl'

# Check if model exists, if not train it
if not os.path.exists(MODEL_PATH):
    print("⚠️  Model not found. Training new model...")
    exec(open('train_model.py').read())

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'ML Prediction Service'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features
        temperature = data.get('temperature')
        vibration = data.get('vibration')
        runtime = data.get('runtime')
        maintenance_gap = data.get('maintenance_gap')
        
        # Validate input
        if None in [temperature, vibration, runtime, maintenance_gap]:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Prepare features
        features = np.array([[temperature, vibration, runtime, maintenance_gap]])
        features_scaled = scaler.transform(features)
        
        # Predict
        failure_probability = model.predict_proba(features_scaled)[0][1]
        
        # Determine risk level
        if failure_probability < 0.3:
            risk_level = 'Low'
        elif failure_probability < 0.7:
            risk_level = 'Medium'
        else:
            risk_level = 'High'
        
        return jsonify({
            'failure_probability': float(failure_probability),
            'risk_level': risk_level,
            'confidence': float(max(model.predict_proba(features_scaled)[0]))
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🤖 Starting ML Prediction Service...")
    print("📊 Model loaded successfully")
    app.run(host='0.0.0.0', port=5001, debug=True)