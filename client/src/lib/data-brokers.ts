export interface DataBrokerInfo {
  name: string;
  url: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  optOutUrl?: string;
  optOutProcess: string;
  requiredInfo: string[];
  estimatedProcessingTime: string;
  difficultyRating: number;
  icon: string;
}

export const dataBrokerCategories = {
  'people-search': 'People Search Sites',
  'marketing': 'Marketing Databases', 
  'credit': 'Credit & Financial',
  'public-records': 'Public Records'
};

export const priorityColors = {
  high: 'destructive',
  medium: 'accent', 
  low: 'primary'
};

export const categoryIcons = {
  'people-search': 'fas fa-users',
  'marketing': 'fas fa-bullhorn',
  'credit': 'fas fa-credit-card',
  'public-records': 'fas fa-database'
};
