// components/pose-detection/PoseInstructions.jsx
import React from 'react';
import { CheckCircle, Clock, Target, Users, Award, Heart } from 'lucide-react';

const PoseInstructions = ({ poseId, poseName }) => {
  // Instructions for different poses
  const poseInstructions = {
    'tree_pose': {
      steps: [
        'Stand straight on one leg (right leg recommended for beginners)',
        'Place the sole of your left foot on the inner thigh or calf of the right leg',
        'Bring hands to prayer position at your chest (Anjali Mudra)',
        'Focus on a fixed point straight ahead for better balance',
        'Hold for 30-60 seconds, then switch legs'
      ],
      tips: [
        'Keep your standing leg slightly bent for stability',
        'Engage your core muscles throughout',
        'Don\'t place foot on the knee joint',
        'If balance is difficult, start with foot on ankle'
      ],
      benefits: [
        'Improves balance and coordination',
        'Strengthens legs and core muscles',
        'Increases focus and concentration',
        'Stretches thighs, groins, and shoulders'
      ]
    },
    'warrior_pose': {
      steps: [
        'Stand with feet 3-4 feet apart',
        'Turn right foot out 90 degrees, left foot in slightly (15-30 degrees)',
        'Bend right knee to 90 degrees, keeping knee aligned with ankle',
        'Extend arms parallel to ground, palms facing down',
        'Gaze over your right hand',
        'Hold for 30-60 seconds, then switch sides'
      ],
      tips: [
        'Keep back leg straight and strong',
        'Front knee should not go past ankle',
        'Keep hips squared to the front',
        'Shoulders relaxed, away from ears'
      ],
      benefits: [
        'Strengthens legs and ankles',
        'Stretches groins, chest, and lungs',
        'Increases stamina and concentration',
        'Relieves backaches'
      ]
    },
    'mountain_pose': {
      steps: [
        'Stand with feet together or hip-width apart',
        'Distribute weight evenly across both feet',
        'Engage thigh muscles and lift kneecaps',
        'Lengthen tailbone toward floor',
        'Roll shoulders back and down',
        'Relax arms by your sides, palms facing forward',
        'Hold for 30-60 seconds'
      ],
      tips: [
        'Imagine a string pulling you up from the crown of your head',
        'Breathe deeply and evenly',
        'Ground through all four corners of your feet',
        'Keep chin parallel to the ground'
      ],
      benefits: [
        'Improves posture and balance',
        'Strengthens thighs, knees, and ankles',
        'Relieves sciatica',
        'Reduces flat feet'
      ]
    },
    'downward_dog': {
      steps: [
        'Start on hands and knees (tabletop position)',
        'Place hands shoulder-width apart, fingers spread wide',
        'Tuck toes under and lift hips up and back',
        'Straighten legs as much as comfortable',
        'Press heels toward the ground (they don\'t need to touch)',
        'Keep head between arms, ears in line with biceps',
        'Hold for 30-60 seconds'
      ],
      tips: [
        'Bend knees if hamstrings are tight',
        'Rotate thighs inward slightly',
        'Press firmly through palms and knuckles',
        'Engage core to protect lower back'
      ],
      benefits: [
        'Strengthens arms and legs',
        'Stretches hamstrings and calves',
        'Relieves back pain and sciatica',
        'Calms the mind and relieves stress'
      ]
    },
    'child_pose': {
      steps: [
        'Kneel on the floor with big toes touching',
        'Sit back on your heels',
        'Fold forward, resting forehead on the mat',
        'Extend arms forward or rest them alongside your body',
        'Relax completely into the pose',
        'Hold for 1-3 minutes'
      ],
      tips: [
        'Use a cushion under forehead if needed',
        'Keep buttocks connected to heels',
        'Breathe deeply into your back',
        'Allow shoulders to relax completely'
      ],
      benefits: [
        'Gently stretches hips, thighs, and ankles',
        'Relieves back and neck pain',
        'Calms the brain and reduces stress',
        'Helps relieve fatigue'
      ]
    },
    'cobra_pose': {
      steps: [
        'Lie on your stomach with legs extended',
        'Place palms under shoulders, elbows close to body',
        'Press tops of feet and thighs into the floor',
        'Inhale and lift chest off the floor',
        'Keep elbows slightly bent, shoulders away from ears',
        'Gaze forward or slightly upward',
        'Hold for 15-30 seconds, then release'
      ],
      tips: [
        'Don\'t push too hard with your arms',
        'Engage back muscles more than arm muscles',
        'Keep pubic bone pressed into the floor',
        'Avoid compressing the lower back'
      ],
      benefits: [
        'Strengthens the spine',
        'Stretches chest, lungs, and abdomen',
        'Firms buttocks',
        'Helps relieve stress and fatigue'
      ]
    }
  };

  const instructions = poseInstructions[poseId] || poseInstructions['tree_pose'];

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div>
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Step-by-Step Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          {instructions.steps.map((step, index) => (
            <li key={index} className="text-sm text-slate-300 pl-2">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      <div>
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          Pro Tips
        </h3>
        <ul className="space-y-2">
          {instructions.tips.map((tip, index) => (
            <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          Benefits
        </h3>
        <ul className="space-y-2">
          {instructions.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Duration */}
      <div className="p-4 bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Recommended Duration</p>
              <p className="text-xs text-slate-400">Hold for best results</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">30-60s</p>
            <p className="text-xs text-slate-400">per side</p>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="p-4 bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-white">Difficulty Level</p>
              <p className="text-xs text-slate-400">Suitable for</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium">
            {poseId === 'tree_pose' || poseId === 'mountain_pose' || poseId === 'child_pose' ? 'Beginner' : 'Intermediate'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseInstructions;