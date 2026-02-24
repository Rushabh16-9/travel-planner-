export type VibeType = 'Adventure' | 'Chill' | 'Culture' | 'Foodie';
export type Period = 'Morning' | 'Afternoon' | 'Evening';
export type Importance = 'High' | 'Medium' | 'Low';

export interface Activity {
  time: string;
  name?: string;
  title?: string;
  description: string;
  vibe?: VibeType;
  type?: string;
  estimatedCost?: number;
  price?: number | string;
  period?: Period;
  importance: Importance;
}

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

export interface TripData {
  destination: string;
  duration: number;
  itinerary: DayItinerary[];
  totalCost: number;
}

export const mockTripData: TripData = {
  destination: 'Paris, France',
  duration: 3,
  totalCost: 1450,
  itinerary: [
    {
      day: 1,
      date: 'March 15, 2026',
      activities: [
        {
          time: '09:00 AM',
          name: 'Eiffel Tower Summit',
          description: 'Start your trip with the best view in Paris.',
          vibe: 'Adventure',
          estimatedCost: 35,
          period: 'Morning',
          importance: 'High',
        },
        {
          time: '12:30 PM',
          name: 'Lunch at Le Jules Verne',
          description: 'Michelin-star dining on the Eiffel Tower.',
          vibe: 'Foodie',
          estimatedCost: 120,
          period: 'Afternoon',
          importance: 'Medium',
        },
        {
          time: '03:00 PM',
          name: 'Seine River Cruise',
          description: 'Relaxing boat tour passing Notre-Dame.',
          vibe: 'Chill',
          estimatedCost: 25,
          period: 'Afternoon',
          importance: 'Low',
        },
        {
          time: '06:00 PM',
          name: 'Montmartre Walk',
          description: 'Explore the artistic streets and Sacré-Cœur.',
          vibe: 'Culture',
          estimatedCost: 15,
          period: 'Evening',
          importance: 'Medium',
        },
        {
          time: '08:30 PM',
          name: 'Dinner at Le Consulat',
          description: 'Historic bistro in the heart of Montmartre.',
          vibe: 'Foodie',
          estimatedCost: 65,
          period: 'Evening',
          importance: 'Low',
        },
      ],
    },
    {
      day: 2,
      date: 'March 16, 2026',
      activities: [
        {
          time: '10:00 AM',
          name: 'Louvre Museum',
          description: 'See the Mona Lisa and Venus de Milo.',
          vibe: 'Culture',
          estimatedCost: 20,
          period: 'Morning',
          importance: 'High',
        },
        {
          time: '01:00 PM',
          name: 'Café Marly',
          description: 'Lunch with a view of the pyramids.',
          vibe: 'Foodie',
          estimatedCost: 45,
          period: 'Afternoon',
          importance: 'Medium',
        },
        {
          time: '03:30 PM',
          name: 'Champs-Élysées',
          description: 'Luxury shopping and strolling.',
          vibe: 'Chill',
          estimatedCost: 200,
          period: 'Afternoon',
          importance: 'Low',
        },
        {
          time: '06:00 PM',
          name: 'Arc de Triomphe',
          description: 'Sunset views from the top.',
          vibe: 'Adventure',
          estimatedCost: 15,
          period: 'Evening',
          importance: 'Medium',
        },
        {
          time: '08:00 PM',
          name: 'Seine Dinner Cruise',
          description: 'Gourmet dining on the water.',
          vibe: 'Foodie',
          estimatedCost: 150,
          period: 'Evening',
          importance: 'High',
        },
      ],
    },
    {
      day: 3,
      date: 'March 17, 2026',
      activities: [
        {
          time: '09:30 AM',
          name: 'Versailles Palace',
          description: 'Day trip to the royal grandiose.',
          vibe: 'Culture',
          estimatedCost: 50,
          period: 'Morning',
          importance: 'High',
        },
        {
          time: '01:00 PM',
          name: 'La Petite Venise',
          description: 'Italian lunch in the gardens.',
          vibe: 'Foodie',
          estimatedCost: 55,
          period: 'Afternoon',
          importance: 'Medium',
        },
        {
          time: '03:30 PM',
          name: 'Royal Gardens',
          description: 'Walk through the massive estates.',
          vibe: 'Chill',
          estimatedCost: 0,
          period: 'Afternoon',
          importance: 'Low',
        },
        {
          time: '06:00 PM',
          name: 'Latin Quarter',
          description: 'Bookshops and bohemian vibes.',
          vibe: 'Culture',
          estimatedCost: 10,
          period: 'Evening',
          importance: 'Medium',
        },
        {
          time: '08:30 PM',
          name: 'Le Procope',
          description: 'Dinner at the oldest cafe in Paris.',
          vibe: 'Foodie',
          estimatedCost: 80,
          period: 'Evening',
          importance: 'Low',
        },
      ],
    },
  ],
};
