from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class VfcDietRecommendation:
    def __init__(self, age, height, weight, activity_level, body_type):
        self.age = int(age)
        self.height = int(height)
        self.weight = int(weight)
        self.activity_level = activity_level
        self.body_type = body_type
        self.bmr = self.calculate_bmr()

    def calculate_bmr(self):
        if self.body_type == "endomorphic":
            return (10 * self.weight) + (6.25 * self.height) - (5 * self.age) - 161
        elif self.body_type == "ectomorphic":
            return (10 * self.weight) + (6.25 * self.height) - (5 * self.age) + 5
        else:  # mesomorphic
            return (10 * self.weight) + (6.25 * self.height) - (5 * self.age) + 100

    def calculate_calories(self, goal):
        activity_levels = {
            "sedentary": 1.2,
            "lightly_active": 1.375,
            "moderately_active": 1.55,
            "very_active": 1.725,
            "extra_active": 1.9
        }
        tdee = self.bmr * activity_levels.get(self.activity_level, 1.2)

        if goal == "weight_loss":
            return tdee * 0.8
        elif goal == "weight_gain":
            return tdee * 1.2
        else:  # maintain
            return tdee

class DietRecommendationSystem:
    def __init__(self, user):
        self.user = user
        # Load data with proper error handling
        self.breakfast_items = self._load_data("Data_sets/breakfast_data.csv")
        self.lunch_items = self._load_data("Data_sets/lunch_data.csv")
        self.dinner_items = self._load_data("Data_sets/dinner_data.csv")

    def _load_data(self, filepath):
        """Load data with proper error handling and ensure required columns exist"""
        try:
            df = pd.read_csv(filepath)
            
            # Ensure required columns exist
            required_columns = ['Food_items', 'Calories', 'Fats', 'Proteins', 'Carbohydrates', 'Link']
            for col in required_columns:
                if col not in df.columns:
                    if col == 'Link':
                        df[col] = ''  # Initialize empty Link column if missing
                    else:
                        df[col] = 0   # Initialize numeric columns with 0 if missing
            
            # Clean up data
            df = df.dropna(subset=['Food_items'])  # Remove rows without food names
            df = df.fillna(0)  # Fill other NA values with 0
            
            # Ensure numeric columns are numeric
            numeric_cols = ['Calories', 'Fats', 'Proteins', 'Carbohydrates']
            for col in numeric_cols:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                
            return df
            
        except Exception as e:
            print(f"Error loading {filepath}: {str(e)}")
            # Return empty dataframe with required columns
            return pd.DataFrame(columns=['Food_items', 'Calories', 'Fats', 'Proteins', 'Carbohydrates', 'Link'])

    def diverse_kmeans_recommendation(self, meal_items, target_calories, k=3, n_items=3):
        """Generate diverse recommendations using KMeans clustering"""
        if meal_items.empty:
            return pd.DataFrame(columns=['Food_items', 'Calories', 'Fats', 'Proteins', 'Carbohydrates', 'Link'])
            
        # Use only items with positive calories
        meal_items = meal_items[meal_items['Calories'] > 0]
        if meal_items.empty:
            return pd.DataFrame(columns=['Food_items', 'Calories', 'Fats', 'Proteins', 'Carbohydrates', 'Link'])

        # Prepare features for clustering
        features = ['Calories', 'Proteins', 'Carbohydrates', 'Fats']
        X = meal_items[features].values
        
        # Apply KMeans clustering
        kmeans = KMeans(n_clusters=min(k, len(meal_items)), random_state=42).fit(X)
        
        # Add cluster labels to the dataframe
        meal_items = meal_items.copy()
        meal_items['Cluster'] = kmeans.labels_
        
        # Get cluster centers and calculate their distance from target calories
        cluster_centers = kmeans.cluster_centers_[:, 0]  # Using only calories for ranking
        cluster_diffs = np.abs(cluster_centers - target_calories)
        ranked_clusters = np.argsort(cluster_diffs)
        
        # Select one item from each cluster, starting with closest to target
        recommendations = pd.DataFrame()
        for cluster_idx in ranked_clusters:
            cluster_data = meal_items[meal_items['Cluster'] == cluster_idx]
            if not cluster_data.empty:
                selected = cluster_data.sample(1)
                recommendations = pd.concat([recommendations, selected])
            if len(recommendations) >= n_items:
                break
                
        # Ensure we have the required number of items
        if len(recommendations) < n_items:
            remaining = n_items - len(recommendations)
            additional = meal_items[~meal_items.index.isin(recommendations.index)].sample(remaining)
            recommendations = pd.concat([recommendations, additional])
            
        # Ensure Link column has proper values
        recommendations['Link'] = recommendations['Link'].apply(
            lambda x: x if x and str(x).startswith('http') else 
            f"https://source.unsplash.com/random/300x200/?{recommendations['Food_items'].str.replace(' ', '+')}"
        )
            
        return recommendations.drop(columns=["Cluster"], errors="ignore").reset_index(drop=True)

    def recommend_diet_kmeans(self, goal):
        """Generate complete diet recommendation based on user's goal"""
        total_calories = self.user.calculate_calories(goal)
        
        # Define calorie distribution based on goal
        if goal == "weight_loss":
            b_pct, l_pct, d_pct = 0.3, 0.4, 0.3
        elif goal == "weight_gain":
            b_pct, l_pct, d_pct = 0.25, 0.35, 0.4
        else:  # maintain
            b_pct, l_pct, d_pct = 0.3, 0.4, 0.3

        breakfast_calories = total_calories * b_pct / 3  # Divided by 3 items
        lunch_calories = total_calories * l_pct / 3
        dinner_calories = total_calories * d_pct / 3
        
        # Generate recommendations
        recommended_diet = {
            "Breakfast": self._ensure_link_column(
                self.diverse_kmeans_recommendation(self.breakfast_items, breakfast_calories, k=4).to_dict('records')
            ),
            "Lunch": self._ensure_link_column(
                self.diverse_kmeans_recommendation(self.lunch_items, lunch_calories, k=3).to_dict('records')
            ),
            "Dinner": self._ensure_link_column(
                self.diverse_kmeans_recommendation(self.dinner_items, dinner_calories, k=4).to_dict('records')
            ),
            "total_calories": round(total_calories),
            "tdee": round(self.user.bmr * {
                "sedentary": 1.2,
                "lightly_active": 1.375,
                "moderately_active": 1.55,
                "very_active": 1.725,
                "extra_active": 1.9
            }.get(self.user.activity_level, 1.2))
        }
        
        return recommended_diet

    def _ensure_link_column(self, records):
        """Ensure each record has a valid image link"""
        for record in records:
            if 'Link' not in record or not record['Link'] or not str(record['Link']).startswith('http'):
                food_name = record.get('Food_items', '').replace(' ', '+')
                record['Link'] = f"https://source.unsplash.com/random/300x200/?{food_name}"
        return records

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Diet Recommendation System",
        "version": "1.0.0"
    })

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['age', 'height', 'weight', 'activity_level', 'body_type', 'goal']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        user = VfcDietRecommendation(
            age=data['age'],
            height=data['height'],
            weight=data['weight'],
            activity_level=data['activity_level'],
            body_type=data['body_type']
        )
        
        diet_system = DietRecommendationSystem(user)
        recommendations = diet_system.recommend_diet_kmeans(data['goal'])
        
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    if not os.path.exists('Data_sets'):
        os.makedirs('Data_sets')
        print("Created Data_sets directory - please add your CSV files here")
    
    app.run(debug=True, port=5002)