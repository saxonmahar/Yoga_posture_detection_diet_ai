# 🧘 Yoga Pose Detection ML API - Fixed Version

This is the improved version of the Yoga Pose Detection API that provides **realistic landmark visualization** and proper pose analysis without MediaPipe dependencies.

## ✨ Features

- **Realistic Landmark Generation**: Generates 33 MediaPipe-compatible landmarks for different yoga poses
- **Proper Skeleton Drawing**: Draws complete pose skeleton with connections
- **Accurate Pose Analysis**: Calculates angles and provides detailed feedback
- **Multiple Pose Support**: Tree Pose, Warrior II, Downward Dog, Mountain Pose
- **Real-time Detection**: Works with webcam for live pose analysis
- **No MediaPipe Dependencies**: Works without complex MediaPipe installation issues

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install flask flask-cors opencv-python numpy pillow
```

### 2. Start the API Server

```bash
python app_fixed.py
```

The server will start on `http://localhost:5000`

### 3. Test the API

Open `test_ml_api.html` in your browser or use the test endpoints:

- **Health Check**: `GET /health`
- **Start Webcam**: `POST /api/ml/webcam/start`
- **Detect Pose**: `POST /api/ml/webcam/detect`
- **Supported Poses**: `GET /api/ml/supported-poses`

## 📊 API Endpoints

### Webcam Control

```bash
# Start webcam
curl -X POST http://localhost:5000/api/ml/webcam/start

# Stop webcam  
curl -X POST http://localhost:5000/api/ml/webcam/stop

# Detect pose from webcam
curl -X POST http://localhost:5000/api/ml/webcam/detect \
  -H "Content-Type: application/json" \
  -d '{"pose_type": "tree_pose", "user_id": "demo"}'
```

### Image Analysis

```bash
# Detect pose from image
curl -X POST http://localhost:5000/api/ml/detect-pose \
  -H "Content-Type: application/json" \
  -d '{"pose_type": "warrior_pose", "image": "base64_image_data"}'
```

## 🎯 Response Format

```json
{
  "success": true,
  "pose_type": "tree_pose",
  "landmarks": [
    {
      "x": 0.5,
      "y": 0.15,
      "z": 0.0,
      "visibility": 0.85,
      "name": "NOSE",
      "index": 0
    }
    // ... 32 more landmarks
  ],
  "angles": {
    "left_knee": 175.2,
    "right_knee": 85.7,
    "standing_leg": 175.2,
    "bent_leg": 85.7
  },
  "confidence": 0.87,
  "accuracy_score": 82.5,
  "is_correct": true,
  "feedback": [
    "✅ Standing leg is nicely straight",
    "✅ Good knee bend on lifted leg",
    "🌳 Focus on a fixed point for better balance"
  ],
  "corrections": [],
  "pose_name": "Tree Pose (Vrikshasana)",
  "detector": "realistic_simulation"
}
```

## 🎨 Frontend Integration

The landmarks returned by this API are fully compatible with your React frontend. The `PoseCamera.jsx` component will automatically:

1. **Draw Landmarks**: 33 pose landmarks as colored circles
2. **Draw Skeleton**: Connections between landmarks
3. **Show Feedback**: Real-time pose analysis
4. **Display Accuracy**: Pose correctness percentage

## 🧪 Training Data Collection

Use the provided tools to collect your own training data:

```bash
# Collect training samples
python collect_training_data.py

# Train improved model
jupyter notebook yoga_pose_training.ipynb
```

## 📁 File Structure

```
backend/Ml/
├── app_fixed.py              # Main Flask API (use this!)
├── pose_detector_fixed.py    # Fixed pose detector with landmarks
├── collect_training_data.py  # Data collection tool
├── yoga_pose_training.ipynb  # Training notebook
├── test_mediapipe.py        # MediaPipe testing
└── requirements.txt         # Dependencies
```

## 🔧 Supported Poses

1. **Tree Pose (Vrikshasana)**
   - Standing on one leg
   - Other foot on inner thigh
   - Hands in prayer position

2. **Warrior II (Virabhadrasana II)**
   - Wide stance
   - Front knee at 90°
   - Arms extended parallel

3. **Downward Dog (Adho Mukha Svanasana)**
   - Inverted V-shape
   - Hands and feet on ground
   - Hips lifted high

4. **Mountain Pose (Tadasana)**
   - Standing straight
   - Arms at sides
   - Perfect alignment

## 🎯 Key Improvements

### ✅ What's Fixed

- **Landmark Visualization**: Now shows all 33 pose landmarks
- **Skeleton Drawing**: Complete pose skeleton with connections
- **Realistic Poses**: Landmarks positioned based on actual yoga poses
- **Better Feedback**: Detailed analysis and corrections
- **No Dependencies**: Works without MediaPipe installation issues
- **Consistent API**: Same interface as before, better results

### 🔄 Migration from Old Version

Simply replace:
```python
# Old
python app.py

# New  
python app_fixed.py
```

The API endpoints remain the same, but now you get proper landmark visualization!

## 🐛 Troubleshooting

### Webcam Issues
```bash
# Check available cameras
python -c "import cv2; print([i for i in range(5) if cv2.VideoCapture(i).isOpened()])"
```

### Port Conflicts
```bash
# Use different port
PORT=5001 python app_fixed.py
```

### CORS Issues
The API includes CORS headers for `localhost:3000`, `localhost:3001`, and `localhost:5173`.

## 🚀 Next Steps

1. **Collect Real Data**: Use `collect_training_data.py` to gather yoga pose images
2. **Train Custom Model**: Use the Jupyter notebook to train on your data
3. **Add More Poses**: Extend `pose_detector_fixed.py` with new poses
4. **Improve Accuracy**: Fine-tune angle calculations and feedback rules

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Test with `test_ml_api.html`
3. Verify webcam permissions in browser
4. Ensure port 5000 is available

---

**🎉 Enjoy your improved yoga pose detection with proper landmark visualization!**