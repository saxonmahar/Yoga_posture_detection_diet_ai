'use client'

import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('yogaai-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('yogaai-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      isPremium: false,
      stats: {
        totalWorkouts: 12,
        totalCaloriesBurned: 1200,
        currentStreak: 5,
        averageAccuracy: 75,
        weight: 70,
        height: 175,
        goal: 'weight-loss',
        activityLevel: 'moderate',
        age: 28
      }
    }
    
    setUser(mockUser)
    localStorage.setItem('yogaai-user', JSON.stringify(mockUser))
    setIsLoading(false)
    return { success: true, user: mockUser }
  }

  const register = async (userData) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      isPremium: false,
      stats: {
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        currentStreak: 0,
        averageAccuracy: 0,
        weight: userData.weight || 70,
        height: userData.height || 175,
        goal: userData.goal || 'weight-loss',
        activityLevel: userData.activityLevel || 'moderate',
        age: userData.age || 25
      }
    }
    
    setUser(newUser)
    localStorage.setItem('yogaai-user', JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('yogaai-user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('yogaai-user', JSON.stringify(updatedUser))
    return updatedUser
  }

  const updateUserStats = (statsUpdates) => {
    if (!user) return null
    
    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        ...statsUpdates
      }
    }
    
    setUser(updatedUser)
    localStorage.setItem('yogaai-user', JSON.stringify(updatedUser))
    return updatedUser
  }

  const completeWorkout = (workoutData) => {
    if (!user) return null
    
    const { duration, calories, accuracy } = workoutData
    const newTotalWorkouts = user.stats.totalWorkouts + 1
    const newCalories = user.stats.totalCaloriesBurned + calories
    const newAverageAccuracy = Math.round(
      (user.stats.averageAccuracy * user.stats.totalWorkouts + accuracy) / newTotalWorkouts
    )
    const newStreak = user.stats.currentStreak + 1
    
    return updateUserStats({
      totalWorkouts: newTotalWorkouts,
      totalCaloriesBurned: newCalories,
      averageAccuracy: newAverageAccuracy,
      currentStreak: newStreak,
      bestStreak: Math.max(user.stats.bestStreak || 0, newStreak)
    })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser,
      updateUserStats,
      completeWorkout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}