import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, ArrowRight, User, Target, Clock } from 'lucide-react';

const PrePoseInstructions = ({ 
  pose, 
  onStartPose, 
  onSkipInstructions,
  isVisible = true 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // Detailed step-by-step instructions for each pose
  const poseInstructions = {
    'yog1': {
      name: 'Warrior II (Virabhadrasana II)',
      icon: '⚔️',
      duration: '30-60 seconds',
      difficulty: 'Intermediate',
      steps: [
        {
          title: "Starting Position",
          instruction: "Stand straight in the center of the camera with feet together",
          tip: "Make sure your whole body is visible in the frame"
        },
        {
          title: "Widen Your Stance", 
          instruction: "Step your feet wide apart, about 4-5 feet distance",
          tip: "Your feet should be wider than your shoulders"
        },
        {
          title: "Turn Right Foot",
          instruction: "Turn your right foot out 90 degrees to the right",
          tip: "Your right foot should point to the side of the mat"
        },
        {
          title: "Bend Right Knee",
          instruction: "Bend your right knee directly over your ankle",
          tip: "Keep your thigh parallel to the floor if possible"
        },
        {
          title: "Extend Arms",
          instruction: "Raise both arms parallel to the floor, reaching in opposite directions",
          tip: "Keep your arms strong and engaged, palms facing down"
        },
        {
          title: "Final Position",
          instruction: "Hold this position with strength and stability",
          tip: "Breathe deeply and maintain your balance"
        }
      ],
      benefits: ["Strengthens legs and core", "Improves balance", "Opens hips and chest"],
      preparationTime: 15
    },
    'yog2': {
      name: 'T Pose',
      icon: '🤸',
      duration: '15-30 seconds',
      difficulty: 'Beginner',
      steps: [
        {
          title: "Starting Position",
          instruction: "Stand straight in the center of the camera",
          tip: "Keep your feet hip-width apart for stability"
        },
        {
          title: "Engage Your Core",
          instruction: "Tighten your abdominal muscles and straighten your spine",
          tip: "Imagine a string pulling you up from the top of your head"
        },
        {
          title: "Raise Your Arms",
          instruction: "Slowly lift both arms out to your sides",
          tip: "Move slowly and with control"
        },
        {
          title: "Shoulder Height",
          instruction: "Bring your arms parallel to the floor at shoulder height",
          tip: "Your arms should form a straight line across your body"
        },
        {
          title: "Straighten Arms",
          instruction: "Extend your arms fully, reaching through your fingertips",
          tip: "Keep your shoulders relaxed, not hunched up"
        },
        {
          title: "Hold Position",
          instruction: "Maintain this T-shape with strength and stability",
          tip: "Breathe normally and keep your gaze forward"
        }
      ],
      benefits: ["Improves posture", "Strengthens shoulders", "Enhances balance"],
      preparationTime: 10
    },
    'yog3': {
      name: 'Tree Pose (Vrikshasana)',
      icon: '🌳',
      duration: '30-60 seconds each leg',
      difficulty: 'Beginner',
      steps: [
        {
          title: "Starting Position",
          instruction: "Stand tall in the center of the camera",
          tip: "Find a focal point ahead to help with balance"
        },
        {
          title: "Ground Left Foot",
          instruction: "Shift your weight onto your left foot",
          tip: "Press your left foot firmly into the ground"
        },
        {
          title: "Lift Right Foot",
          instruction: "Bend your right knee and lift your right foot",
          tip: "Start by placing your foot on your ankle or calf"
        },
        {
          title: "Place on Thigh",
          instruction: "Place your right foot on the inner left thigh",
          tip: "Avoid placing your foot directly on the side of the knee"
        },
        {
          title: "Prayer Position",
          instruction: "Bring your palms together in front of your heart",
          tip: "You can also raise your arms overhead like tree branches"
        },
        {
          title: "Find Balance",
          instruction: "Hold steady and breathe deeply",
          tip: "It's normal to wobble - just keep trying to find your center"
        }
      ],
      benefits: ["Improves balance", "Strengthens legs", "Enhances focus"],
      preparationTime: 12
    },
    'yog4': {
      name: 'Goddess Pose',
      icon: '👸',
      duration: '30-45 seconds',
      difficulty: 'Intermediate',
      steps: [
        {
          title: "Wide Stance",
          instruction: "Stand with feet wide apart, wider than your shoulders",
          tip: "Make sure you have enough space to squat down"
        },
        {
          title: "Turn Feet Out",
          instruction: "Turn both feet out at 45-degree angles",
          tip: "Your knees should track over your toes"
        },
        {
          title: "Lower Into Squat",
          instruction: "Bend your knees and lower into a wide squat",
          tip: "Keep your back straight and chest lifted"
        },
        {
          title: "Raise Arms",
          instruction: "Lift your arms up and bend your elbows at 90 degrees",
          tip: "Make strong 'goal post' arms with palms facing forward"
        },
        {
          title: "Engage Core",
          instruction: "Tighten your core and sink deeper into the squat",
          tip: "Feel the strength in your legs and glutes"
        },
        {
          title: "Hold Strong",
          instruction: "Maintain this powerful goddess position",
          tip: "Breathe deeply and feel your inner strength"
        }
      ],
      benefits: ["Strengthens thighs and glutes", "Opens hips", "Builds confidence"],
      preparationTime: 15
    },
    'yog5': {
      name: 'Downward Facing Dog',
      icon: '🐕',
      duration: '30-60 seconds',
      difficulty: 'Intermediate',
      steps: [
        {
          title: "Start on Hands and Knees",
          instruction: "Begin in a tabletop position on the floor",
          tip: "Hands under shoulders, knees under hips"
        },
        {
          title: "Tuck Your Toes",
          instruction: "Curl your toes under and prepare to lift",
          tip: "Spread your fingers wide for better support"
        },
        {
          title: "Lift Your Hips",
          instruction: "Straighten your legs and lift your hips up and back",
          tip: "Create an inverted V-shape with your body"
        },
        {
          title: "Straighten Arms",
          instruction: "Press firmly through your hands and straighten your arms",
          tip: "Keep your arms strong and shoulders away from ears"
        },
        {
          title: "Lengthen Spine",
          instruction: "Reach your tailbone up and lengthen through your spine",
          tip: "Think of creating space between each vertebra"
        },
        {
          title: "Ground and Reach",
          instruction: "Press hands down while reaching hips up",
          tip: "Pedal your feet to stretch your calves if needed"
        }
      ],
      benefits: ["Stretches entire body", "Strengthens arms", "Energizes mind"],
      preparationTime: 18
    },
    'yog6': {
      name: 'Plank Pose',
      icon: '💪',
      duration: '15-60 seconds',
      difficulty: 'Beginner',
      steps: [
        {
          title: "Start in Push-up Position",
          instruction: "Begin in a high push-up position",
          tip: "Hands directly under your shoulders"
        },
        {
          title: "Align Your Body",
          instruction: "Create a straight line from head to heels",
          tip: "Don't let your hips sag or pike up"
        },
        {
          title: "Engage Core",
          instruction: "Tighten your abdominal muscles strongly",
          tip: "Imagine pulling your belly button to your spine"
        },
        {
          title: "Strong Arms",
          instruction: "Press firmly through your hands and keep arms straight",
          tip: "Distribute weight evenly across your palms"
        },
        {
          title: "Neutral Neck",
          instruction: "Keep your head in line with your spine",
          tip: "Look down at the floor, not forward"
        },
        {
          title: "Hold Strong",
          instruction: "Maintain this strong plank position",
          tip: "Breathe steadily and keep everything engaged"
        }
      ],
      benefits: ["Strengthens core", "Builds endurance", "Improves posture"],
      preparationTime: 12
    }
  };

  const currentPose = poseInstructions[pose] || poseInstructions['yog2'];
  const currentInstruction = currentPose.steps[currentStep];

  // Text-to-Speech function
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-read current instruction
  useEffect(() => {
    if (isVisible && currentInstruction) {
      const timer = setTimeout(() => {
        speak(`${currentInstruction.title}. ${currentInstruction.instruction}. ${currentInstruction.tip}`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible]);

  const nextStep = () => {
    if (currentStep < currentPose.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartPose = () => {
    speak(`Great! Now let's practice ${currentPose.name}. I'll guide you through it.`);
    setTimeout(() => {
      onStartPose();
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentPose.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentPose.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {currentPose.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    {currentPose.duration}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onSkipInstructions}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Skip Instructions
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {currentPose.steps.length}
            </span>
            <span className="text-sm text-emerald-400">
              {Math.round(((currentStep + 1) / currentPose.steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / currentPose.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instructions */}
            <div>
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentStep + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{currentInstruction.title}</h3>
                  {isReading && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Reading...</span>
                    </div>
                  )}
                </div>
                
                <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                  {currentInstruction.instruction}
                </p>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-blue-400 font-medium text-sm">Pro Tip:</span>
                      <p className="text-slate-300 text-sm mt-1">{currentInstruction.tip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 0 
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Previous
                </button>

                {currentStep < currentPose.steps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartPose}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all flex items-center gap-2 font-semibold"
                  >
                    <Play className="w-5 h-5" />
                    Start Pose Practice
                  </button>
                )}
              </div>
            </div>

            {/* Benefits & Info */}
            <div>
              <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/30 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Benefits
                </h4>
                <ul className="space-y-2">
                  {currentPose.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-yellow-400" />
                  Ready to Practice?
                </h4>
                <p className="text-slate-300 text-sm mb-4">
                  Take your time with each step. Remember, yoga is about progress, not perfection. 
                  Listen to your body and modify as needed.
                </p>
                <div className="text-xs text-yellow-400">
                  Estimated preparation time: {currentPose.preparationTime} seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrePoseInstructions;