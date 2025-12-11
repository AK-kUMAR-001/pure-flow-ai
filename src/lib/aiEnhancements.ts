/**
 * AI Enhancements for Seasonal, Weather, and Climate Adjustments
 * Integrates real-time weather data with ML predictions for accurate forecasting
 */

// Season type definitions
export type Season = 'summer' | 'winter' | 'monsoon' | 'spring' | 'autumn';
export type WeatherCondition = 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';

export interface WeatherData {
  temperature: number; // in Celsius
  humidity: number; // in percentage
  rainfall: number; // in mm
  windSpeed: number; // in km/h
  condition: WeatherCondition;
  timestamp: Date;
}

export interface ClimatePattern {
  region: string;
  averageRainfall: number;
  averageTemperature: number;
  humidity: number;
  season: Season;
}

export interface SeasonalAdjustment {
  season: Season;
  multiplier: number;
  description: string;
}

export interface AIEnhancedPrediction {
  basePrediction: number;
  seasonalAdjustment: number;
  weatherAdjustment: number;
  climateAdjustment: number;
  finalPrediction: number;
  confidence: number;
  factors: string[];
}

/**
 * Get current season based on date and region
 */
export const getCurrentSeason = (date: Date, latitude: number): Season => {
  const month = date.getMonth() + 1; // 1-12

  // Northern Hemisphere (India is mostly in NH)
  if (latitude >= 0) {
/**
 * Calculate weather-based adjustment factor
 */
export const calculateWeatherAdjustment = (weather: WeatherData): number => {
  let adjustment = 1.0;

  // Temperature impact (±0.05 per 5°C deviation from 25°C ideal)
  const tempDeviation = (weather.temperature - 25) / 5;
  adjustment += tempDeviation * 0.05;

  // Rainfall impact (reduces water usage)
  if (weather.rainfall > 0) {
    adjustment -= Math.min(weather.rainfall / 100, 0.3); // Max 30% reduction
  }

  // Humidity impact (high humidity reduces evaporation)
  if (weather.humidity > 70) {
    adjustment -= (weather.humidity - 70) / 500; // Small reduction
  }

  // Weather condition impact
  const conditionFactors: Record<WeatherCondition, number> = {
    clear: 1.1,      // +10% in clear weather
    cloudy: 0.95,    // -5% in cloudy weather
    rainy: 0.6,      // -40% in rainy weather
    stormy: 0.4,     // -60% in stormy weather
    foggy: 0.85,     // -15% in foggy weather
  };

  adjustment *= conditionFactors[weather.condition];

  return Math.max(0.3, Math.min(adjustment, 1.5)); // Clamp between 0.3 and 1.5
};

/**
 * Simulate weather API response (in production, integrate with OpenWeatherMap or similar)
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Example: Using OpenWeatherMap API
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    // );
    // const data = await response.json();

    // For now, return simulated data
    const now = new Date();
    return {
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() > 0.7 ? Math.random() * 10 : 0,
      windSpeed: 5 + Math.random() * 15,
      condition: (['clear', 'cloudy', 'rainy'] as WeatherCondition[])[
        Math.floor(Math.random() * 3)
      ],
      timestamp: now,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default weather if API fails
    return {
      temperature: 25,
      humidity: 70,
      rainfall: 0,
      windSpeed: 10,
      condition: 'clear',
      timestamp: new Date(),
    };
  }
};

/**
 * Get climate pattern for a region
 */
export const getClimatePattern = (region: string, season: Season): ClimatePattern => {
  // Regional climate data (average values)
  const climateData: Record<string, Record<Season, Omit<ClimatePattern, 'region' | 'season'>>> = {
    'Maharashtra': {
      summer: { averageRainfall: 850, averageTemperature: 32, humidity: 65 },
      winter: { averageRainfall: 50, averageTemperature: 18, humidity: 55 },
      monsoon: { averageRainfall: 2200, averageTemperature: 26, humidity: 85 },
      spring: { averageRainfall: 100, averageTemperature: 28, humidity: 60 },
      autumn: { averageRainfall: 200, averageTemperature: 26, humidity: 70 },
    },
    'Delhi': {
      summer: { averageRainfall: 800, averageTemperature: 36, humidity: 45 },
      winter: { averageRainfall: 100, averageTemperature: 12, humidity: 50 },
      monsoon: { averageRainfall: 700, averageTemperature: 28, humidity: 75 },
      spring: { averageRainfall: 150, averageTemperature: 30, humidity: 40 },
      autumn: { averageRainfall: 100, averageTemperature: 25, humidity: 50 },
    },
    'Karnataka': {
      summer: { averageRainfall: 900, averageTemperature: 30, humidity: 70 },
      winter: { averageRainfall: 80, averageTemperature: 22, humidity: 60 },
      monsoon: { averageRainfall: 1800, averageTemperature: 24, humidity: 90 },
      spring: { averageRainfall: 200, averageTemperature: 28, humidity: 65 },
      autumn: { averageRainfall: 300, averageTemperature: 26, humidity: 75 },
    },
  };

  const regionData = climateData[region] || climateData['Maharashtra'];
  const seasonData = regionData[season] || regionData['summer'];

  return {
    region,
    season,
    ...seasonData,
  };
};

/**
 * Calculate monsoon impact adjustment
 * Monsoon period: June-September in India
 */
export const calculateMonsoonImpact = (date: Date, region: string): number => {
  const month = date.getMonth() + 1;
  const isMonsoonPeriod = month >= 6 && month <= 9;

  if (!isMonsoonPeriod) return 1.0;

  // Monsoon impact varies by region
  const monsoonIntensity: Record<string, number> = {
    'Maharashtra': 0.4,    // 60% reduction
    'Karnataka': 0.45,    // 55% reduction
    'Tamil Nadu': 0.35,   // 65% reduction
    'Delhi': 0.65,        // 35% reduction
    'default': 0.55,      // 45% reduction as default
  };

  return monsoonIntensity[region] || monsoonIntensity['default'];
};

/**
 * Calculate climate-based adjustment
 */
export const calculateClimateAdjustment = (climate: ClimatePattern): number => {
  let adjustment = 1.0;

  // Rainfall impact
  const expectedRainfall = climate.averageRainfall;
  if (expectedRainfall > 1000) {
    adjustment -= (expectedRainfall - 1000) / 5000; // Heavy rainfall regions
  } else if (expectedRainfall > 500) {
    adjustment -= (expectedRainfall - 500) / 2000;
  }

  // Temperature impact
  const tempImpact = (climate.averageTemperature - 25) * 0.02;
  adjustment += tempImpact;

  // Humidity impact
  if (climate.humidity > 75) {
    adjustment -= (climate.humidity - 75) / 500;
  }

  return Math.max(0.5, Math.min(adjustment, 1.3)); // Clamp between 0.5 and 1.3
};

/**
 * Enhanced ML prediction with seasonal, weather, and climate adjustments
 */
export const enhanceMLPrediction = async (
  basePrediction: number,
  date: Date = new Date(),
  region: string = 'Maharashtra',
  lat: number = 19.0,
  lon: number = 72.0,
  householdType: string = 'Urban (3 BHK)'
): Promise<AIEnhancedPrediction> => {
  const factors: string[] = [];
  let totalConfidence = 0.95;

  // Step 1: Seasonal Adjustment
  const season = getCurrentSeason(date, lat);
  const seasonalAdj = getSeasonalMultiplier(season);
  const seasonalAdjustment = basePrediction * (seasonalAdj.multiplier - 1);
  factors.push(`${seasonalAdj.description}`);

  // Step 2: Weather Adjustment
  const weather = await fetchWeatherData(lat, lon);
  const weatherAdjustmentFactor = calculateWeatherAdjustment(weather);
  const weatherAdjustment = basePrediction * (weatherAdjustmentFactor - 1);
  
  const weatherDesc = `Weather (${weather.condition}, ${weather.temperature}°C, ${weather.humidity}% humidity)`;
  factors.push(weatherDesc);
  totalConfidence *= 0.98; // Slight confidence reduction for weather variability

  // Step 3: Climate Pattern Adjustment
  const climate = getClimatePattern(region, season);
  const climateAdjustmentFactor = calculateClimateAdjustment(climate);
  const climateAdjustment = basePrediction * (climateAdjustmentFactor - 1);
  factors.push(`Climate pattern for ${region}`);

  // Step 4: Monsoon Impact
  const monsoonFactor = calculateMonsoonImpact(date, region);
  const monsoonAdjustment = basePrediction * (monsoonFactor - 1);
  if (monsoonFactor < 1.0) {
    factors.push(`Monsoon season impact (${((1 - monsoonFactor) * 100).toFixed(0)}% reduction)`);
  }

  // Calculate final prediction
  const finalPrediction = Math.max(
    0,
    basePrediction * 
    seasonalAdj.multiplier * 
    weatherAdjustmentFactor * 
    climateAdjustmentFactor *
    monsoonFactor
  );

  // Add household type confidence factor
  const householdConfidenceFactors: Record<string, number> = {
    'Urban (2 BHK)': 0.98,
    'Urban (3 BHK)': 0.99,
    'Semi-Urban': 0.97,
    'Rural': 0.95,
  };
  totalConfidence *= householdConfidenceFactors[householdType] || 0.96;

  return {
    basePrediction: Math.round(basePrediction * 100) / 100,
    seasonalAdjustment: Math.round(seasonalAdjustment * 100) / 100,
    weatherAdjustment: Math.round(weatherAdjustment * 100) / 100,
    climateAdjustment: Math.round(climateAdjustment * 100) / 100,
    finalPrediction: Math.round(finalPrediction * 100) / 100,
    confidence: Math.round(totalConfidence * 10000) / 100, // As percentage
    factors,
  };
};

/**
 * Generate detailed weather impact report
 */
export const generateWeatherReport = async (
  region: string,
  date: Date = new Date()
): Promise<{
  region: string;
  date: string;
  season: Season;
  weatherData: WeatherData;
  climate: ClimatePattern;
  adjustments: {
    seasonal: number;
    weather: number;
    climate: number;
  };
  recommendations: string[];
}> => {
  const season = getCurrentSeason(date, 19.0); // Default to Mumbai coordinates
  const weather = await fetchWeatherData(19.0, 72.0);
  const climate = getClimatePattern(region, season);

  const seasonalMult = getSeasonalMultiplier(season).multiplier;
  const weatherAdj = calculateWeatherAdjustment(weather);
  const climateAdj = calculateClimateAdjustment(climate);

  const recommendations: string[] = [];

  // Generate recommendations based on conditions
  if (weather.temperature > 32) {
    recommendations.push('High temperature detected - increase water supply capacity');
  }
  if (weather.rainfall > 5) {
    recommendations.push('Heavy rainfall expected - reduce water treatment load');
  }
  if (season === 'monsoon') {
    recommendations.push('Monsoon season - implement rainwater harvesting');
  }
  if (climate.averageRainfall > 1500) {
    recommendations.push('High rainfall region - focus on flood management');
  }
  if (weather.humidity > 80) {
    recommendations.push('High humidity - optimize cooling water requirements');
  }

  return {
    region,
    date: date.toISOString(),
    season,
    weatherData: weather,
    climate,
    adjustments: {
      seasonal: seasonalMult,
      weather: weatherAdj,
      climate: climateAdj,
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Optimal conditions - maintain current operations'],
  };
};

/**
 * Multi-season prediction aggregation
 * Returns predictions for all upcoming seasons
 */
export const generateMultiSeasonPredictions = async (
  currentPrediction: number,
  region: string = 'Maharashtra',
  household: string = 'Urban (3 BHK)'
): Promise<Record<Season, AIEnhancedPrediction>> => {
  const predictions: Record<Season, AIEnhancedPrediction> = {
    summer: await enhanceMLPrediction(currentPrediction, new Date(2024, 4, 15), region, 19.0, 72.0, household),
    monsoon: await enhanceMLPrediction(currentPrediction, new Date(2024, 7, 15), region, 19.0, 72.0, household),
    autumn: await enhanceMLPrediction(currentPrediction, new Date(2024, 10, 15), region, 19.0, 72.0, household),
    winter: await enhanceMLPrediction(currentPrediction, new Date(2024, 1, 15), region, 19.0, 72.0, household),
    spring: await enhanceMLPrediction(currentPrediction, new Date(2024, 3, 15), region, 19.0, 72.0, household),
  };

  return predictions;
};

/**
 * Export AI enhancements summary
 */
export const exportAIEnhancementsSummary = (prediction: AIEnhancedPrediction): string => {
  return `
ENHANCED WATER PREDICTION REPORT
================================

Base Prediction: ${prediction.basePrediction} L/day
Final Prediction: ${prediction.finalPrediction} L/day

Adjustments:
- Seasonal: ${prediction.seasonalAdjustment > 0 ? '+' : ''}${prediction.seasonalAdjustment.toFixed(2)} L
- Weather: ${prediction.weatherAdjustment > 0 ? '+' : ''}${prediction.weatherAdjustment.toFixed(2)} L
- Climate: ${prediction.climateAdjustment > 0 ? '+' : ''}${prediction.climateAdjustment.toFixed(2)} L

Confidence: ${prediction.confidence.toFixed(1)}%

Impact Factors:
${prediction.factors.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Recommendation: Plan water usage based on ${prediction.finalPrediction} L/day
  `;
};

/**
 * Get climate recommendations
 */
export const getClimateRecommendations = (region: string, month: number = new Date().getMonth() + 1): string[] => {
  const recommendations: string[] = [];

  // Monsoon recommendations
  if (month >= 6 && month <= 9) {
    const monsoonIntensity: Record<string, number> = {
      'Maharashtra': 0.4,
      'Karnataka': 0.45,
      'Tamil Nadu': 0.35,
      'Delhi': 0.65,
      'default': 0.55,
    };
    const intensity = monsoonIntensity[region] || monsoonIntensity['default'];
    if (intensity > 0.35) {
      recommendations.push('🌧️ Heavy monsoon expected: Store harvested rainwater');
      recommendations.push('⚠️ Check for water contamination after heavy rainfall');
    }
  }

  // Summer recommendations
  if (month >= 3 && month <= 5) {
    recommendations.push('☀️ Summer season: Expect 35% higher water usage');
    recommendations.push('💧 Install shading for water tanks to reduce evaporation');
  }

  // Winter recommendations
  if (month <= 2 || month === 12) {
    recommendations.push('❄️ Winter season: Lower water demand expected');
  }

  return recommendations;
};

/**
 * Export for testing
 */
export const testEnhancedModule = () => {
  console.log('✅ AI Enhancements Module Loaded');
  console.log('Features:');
  console.log('- Seasonal adjustments: 5 seasons');
  console.log('- Weather-based predictions: 5 conditions');
  console.log('- Monsoon impact: Regional calibration');
  console.log('- Climate pattern analysis: Regional data');
  console.log('- Future prediction: Multi-season ahead');
  return true;
};
