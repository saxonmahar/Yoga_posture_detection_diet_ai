// Test script for post-yoga meal recommendations
const fetch = require('node-fetch');

const testData = {
  caloriesBurned: 150,
  duration: 25,
  poses: [
    { poseName: 'tree' },
    { poseName: 'warrior2' }
  ],
  accuracy: 85,
  timeOfDay: 'morning'
};

console.log('🧪 Testing post-yoga meal endpoint...');
console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

fetch('http://localhost:5002/recommend-post-yoga', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
  .then(response => {
    console.log('📥 Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('\n✅ SUCCESS! Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.recommendations && data.recommendations.primary) {
      console.log('\n🍽️ Primary Meal:', data.recommendations.primary.Food_items);
      console.log('📸 Image URL:', data.recommendations.primary.Link);
      console.log('🔥 Calories:', data.recommendations.primary.Calories);
      console.log('💪 Protein:', data.recommendations.primary.Proteins + 'g');
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error.message);
  });
