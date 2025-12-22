// Yoga poses data for pose detection
export const YOGA_POSES = [
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    difficulty: 'Beginner',
    duration: 60,
    calories: 15,
    benefits: ['Improves posture', 'Strengthens thighs', 'Relieves tension'],
    instructions: 'Stand tall with feet together, arms at sides. Engage your core and breathe deeply.'
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    sanskrit: 'Adho Mukha Svanasana',
    difficulty: 'Beginner',
    duration: 90,
    calories: 25,
    benefits: ['Strengthens arms', 'Stretches hamstrings', 'Relieves back pain'],
    instructions: 'Form an inverted V with your body. Hands shoulder-width apart, hips high.'
  },
  {
    id: 'warrior-ii',
    name: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    difficulty: 'Intermediate',
    duration: 120,
    calories: 35,
    benefits: ['Strengthens legs', 'Improves balance', 'Opens hips'],
    instructions: 'Front knee bent at 90°, back leg straight. Arms extended parallel to floor.'
  },
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    sanskrit: 'Vrikshasana',
    difficulty: 'Intermediate',
    duration: 90,
    calories: 20,
    benefits: ['Improves balance', 'Strengthens core', 'Increases focus'],
    instructions: 'Stand on one leg, other foot on inner thigh. Hands in prayer position.'
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    sanskrit: 'Balasana',
    difficulty: 'Beginner',
    duration: 60,
    calories: 10,
    benefits: ['Relieves stress', 'Stretches back', 'Calms mind'],
    instructions: 'Kneel and sit back on heels, fold forward with arms extended.'
  },
  {
    id: 'cobra-pose',
    name: 'Cobra Pose',
    sanskrit: 'Bhujangasana',
    difficulty: 'Beginner',
    duration: 60,
    calories: 15,
    benefits: ['Strengthens spine', 'Opens chest', 'Improves digestion'],
    instructions: 'Lie on stomach, place hands under shoulders, lift chest while keeping hips grounded.'
  },
  {
    id: 'bridge-pose',
    name: 'Bridge Pose',
    sanskrit: 'Setu Bandhasana',
    difficulty: 'Intermediate',
    duration: 90,
    calories: 25,
    benefits: ['Strengthens back', 'Opens chest', 'Relieves stress'],
    instructions: 'Lie on back, bend knees, lift hips while keeping shoulders grounded.'
  },
  {
    id: 'triangle-pose',
    name: 'Triangle Pose',
    sanskrit: 'Trikonasana',
    difficulty: 'Intermediate',
    duration: 75,
    calories: 20,
    benefits: ['Stretches legs', 'Opens hips', 'Improves balance'],
    instructions: 'Stand with legs wide apart, reach one hand to foot, other hand to sky.'
  }
];

// Difficulty levels for filtering
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

// Pose categories
export const POSE_CATEGORIES = {
  STANDING: 'Standing',
  SEATED: 'Seated',
  BACKBEND: 'Backbend',
  FORWARD_FOLD: 'Forward Fold',
  TWIST: 'Twist',
  BALANCE: 'Balance',
  INVERSION: 'Inversion',
  RESTORATIVE: 'Restorative'
};

export default {
  YOGA_POSES,
  DIFFICULTY_LEVELS,
  POSE_CATEGORIES
};
