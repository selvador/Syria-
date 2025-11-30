
export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: 'Infrastructure' | 'Technology' | 'Culture' | 'Economy';
  date: string;
}

export interface StatMetric {
  name: string;
  value: number;
  unit: string;
  year: number;
  growth?: number;
}

export enum MinistryType {
  INFO = 'Ministry of Information',
  TOURISM = 'Ministry of Tourism',
  ECONOMY = 'Ministry of Economy',
  FUTURE = 'Ministry of Future Planning'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  date: string;
}

export interface Citizen {
  firstName: string;
  familyName: string;
  email: string;
  dob: string;
  province: string;
  neighborhood: string;
  street: string;
  occupation: string;
  phone: string;
  currentResidence: string;
  citizenId: string;
  registrationDate: string;
  educationLevel?: string;
  // Social Profile Fields
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  media?: MediaItem[];
  houseUrl?: string;
}
