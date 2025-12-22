// Export all services from one place
export * from './api/client.js';
export * from './api/interceptors.js';
export * from './yoga/yoga.service.js';
export * from './yoga/pose.service.js';
export * from './diet/diet.service.js';
export * from './diet/meal.service.js';
export * from './auth/auth.service.js';

// Or export as named objects
export { yogaService } from './yoga/yoga.service.js';
export { poseService } from './yoga/pose.service.js';
export { dietService } from './diet/diet.service.js';
export { mealService } from './diet/meal.service.js';
export { authService } from './auth/auth.service.js';