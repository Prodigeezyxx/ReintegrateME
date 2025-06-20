
export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'Basic' | 'Intermediate' | 'Advanced' | 'Certified';
  type: 'Technical' | 'Soft Skill' | 'Certification' | 'License';
  keywords: string[];
  relatedSkills?: string[];
}

export const skillsDatabase: SkillCategory[] = [
  {
    id: 'construction',
    name: 'Construction & Manual Labour',
    description: 'Physical and technical skills for construction work',
    skills: [
      { id: 'cscs_labourer', name: 'CSCS Labourer', category: 'construction', type: 'Certification', keywords: ['cscs', 'construction', 'safety', 'site'] },
      { id: 'bricklaying', name: 'Bricklaying', category: 'construction', type: 'Technical', keywords: ['brick', 'mortar', 'building', 'construction'] },
      { id: 'painting_decorating', name: 'Painting & Decorating', category: 'construction', type: 'Technical', keywords: ['paint', 'decorate', 'interior', 'exterior'] },
      { id: 'plastering', name: 'Plastering', category: 'construction', type: 'Technical', keywords: ['plaster', 'walls', 'rendering'] },
      { id: 'tiling', name: 'Tiling', category: 'construction', type: 'Technical', keywords: ['tiles', 'ceramic', 'bathroom', 'kitchen'] },
      { id: 'roofing', name: 'Roofing', category: 'construction', type: 'Technical', keywords: ['roof', 'tiles', 'slate', 'guttering'] },
      { id: 'scaffolding', name: 'Scaffolding', category: 'construction', type: 'Technical', keywords: ['scaffold', 'height', 'safety', 'access'] },
      { id: 'site_cleaning', name: 'Site Cleaning', category: 'construction', type: 'Technical', keywords: ['clean', 'site', 'waste', 'maintenance'] },
      { id: 'traffic_marshalling', name: 'Traffic Marshalling', category: 'construction', type: 'Certification', keywords: ['traffic', 'safety', 'marshal', 'road'] },
      { id: 'demolition', name: 'Demolition Work', category: 'construction', type: 'Technical', keywords: ['demolition', 'tear down', 'site clearance'] },
      { id: 'drylining', name: 'Drylining', category: 'construction', type: 'Technical', keywords: ['drywall', 'plasterboard', 'partition'] },
      { id: 'groundworks', name: 'Groundworks', category: 'construction', type: 'Technical', keywords: ['excavation', 'foundations', 'drainage'] }
    ]
  },
  {
    id: 'driving_logistics',
    name: 'Driving & Logistics',
    description: 'Transportation, delivery and warehouse operations',
    skills: [
      { id: 'hgv_class1', name: 'HGV Class 1 Licence', category: 'driving_logistics', type: 'License', keywords: ['hgv', 'c+e', 'articulated', 'truck'] },
      { id: 'hgv_class2', name: 'HGV Class 2 Licence', category: 'driving_logistics', type: 'License', keywords: ['hgv', 'c1', 'rigid', 'truck'] },
      { id: 'forklift_counterbalance', name: 'Forklift (Counterbalance)', category: 'driving_logistics', type: 'Certification', keywords: ['forklift', 'counterbalance', 'warehouse'] },
      { id: 'forklift_reach', name: 'Forklift (Reach Truck)', category: 'driving_logistics', type: 'Certification', keywords: ['forklift', 'reach truck', 'warehouse'] },
      { id: 'delivery_driving', name: 'Delivery Driving', category: 'driving_logistics', type: 'Technical', keywords: ['delivery', 'courier', 'van'] },
      { id: 'van_driving', name: 'Van Driving (Cat B Licence)', category: 'driving_logistics', type: 'License', keywords: ['van', 'category b', 'driving'] },
      { id: 'courier_work', name: 'Courier Work', category: 'driving_logistics', type: 'Technical', keywords: ['courier', 'parcel', 'delivery'] },
      { id: 'warehouse_picking', name: 'Warehouse Picking & Packing', category: 'driving_logistics', type: 'Technical', keywords: ['warehouse', 'picking', 'packing', 'order'] },
      { id: 'stock_control', name: 'Stock Control', category: 'driving_logistics', type: 'Technical', keywords: ['stock', 'inventory', 'control'] },
      { id: 'goods_handling', name: 'Goods-In/Out Handling', category: 'driving_logistics', type: 'Technical', keywords: ['goods', 'receiving', 'dispatch'] },
      { id: 'route_planning', name: 'Route Planning', category: 'driving_logistics', type: 'Technical', keywords: ['route', 'planning', 'navigation', 'logistics'] }
    ]
  },
  {
    id: 'catering_hospitality',
    name: 'Catering & Hospitality',
    description: 'Food service, customer service and hospitality skills',
    skills: [
      { id: 'kitchen_porter', name: 'Kitchen Porter', category: 'catering_hospitality', type: 'Technical', keywords: ['kitchen', 'porter', 'cleaning', 'prep'] },
      { id: 'chef_assistant', name: 'Chef Assistant', category: 'catering_hospitality', type: 'Technical', keywords: ['chef', 'assistant', 'food prep', 'kitchen'] },
      { id: 'line_cook', name: 'Line Cook', category: 'catering_hospitality', type: 'Technical', keywords: ['line cook', 'grill', 'prep', 'kitchen'] },
      { id: 'front_of_house', name: 'Front of House', category: 'catering_hospitality', type: 'Technical', keywords: ['front of house', 'customer service', 'restaurant'] },
      { id: 'barista', name: 'Barista', category: 'catering_hospitality', type: 'Technical', keywords: ['barista', 'coffee', 'espresso', 'cafe'] },
      { id: 'bartending', name: 'Bartending', category: 'catering_hospitality', type: 'Technical', keywords: ['bartender', 'cocktails', 'bar', 'drinks'] },
      { id: 'waitering', name: 'Waitering/Waitressing', category: 'catering_hospitality', type: 'Technical', keywords: ['waiter', 'waitress', 'serving', 'restaurant'] },
      { id: 'event_setup', name: 'Event Set-up/Breakdown', category: 'catering_hospitality', type: 'Technical', keywords: ['event', 'setup', 'breakdown', 'catering'] },
      { id: 'food_hygiene', name: 'Food Hygiene Certificate', category: 'catering_hospitality', type: 'Certification', keywords: ['food hygiene', 'safety', 'haccp'] },
      { id: 'customer_service_hospitality', name: 'Customer Service (Hospitality)', category: 'catering_hospitality', type: 'Soft Skill', keywords: ['customer service', 'hospitality', 'guest relations'] }
    ]
  },
  {
    id: 'cleaning_maintenance',
    name: 'Cleaning & Maintenance',
    description: 'Cleaning, maintenance and facilities management',
    skills: [
      { id: 'domestic_cleaning', name: 'Domestic Cleaning', category: 'cleaning_maintenance', type: 'Technical', keywords: ['domestic', 'house', 'cleaning', 'residential'] },
      { id: 'commercial_cleaning', name: 'Commercial Cleaning', category: 'cleaning_maintenance', type: 'Technical', keywords: ['commercial', 'office', 'cleaning', 'business'] },
      { id: 'deep_cleaning', name: 'Deep Cleaning', category: 'cleaning_maintenance', type: 'Technical', keywords: ['deep clean', 'thorough', 'detailed'] },
      { id: 'jet_washing', name: 'Jet Washing', category: 'cleaning_maintenance', type: 'Technical', keywords: ['jet wash', 'pressure wash', 'exterior'] },
      { id: 'litter_picking', name: 'Litter Picking', category: 'cleaning_maintenance', type: 'Technical', keywords: ['litter', 'picking', 'street', 'park'] },
      { id: 'window_cleaning', name: 'Window Cleaning', category: 'cleaning_maintenance', type: 'Technical', keywords: ['window', 'glass', 'cleaning'] },
      { id: 'facilities_maintenance', name: 'Facilities Maintenance', category: 'cleaning_maintenance', type: 'Technical', keywords: ['facilities', 'maintenance', 'repair', 'upkeep'] },
      { id: 'groundskeeping', name: 'Groundskeeping', category: 'cleaning_maintenance', type: 'Technical', keywords: ['grounds', 'landscaping', 'gardening', 'maintenance'] },
      { id: 'waste_management', name: 'Waste Management', category: 'cleaning_maintenance', type: 'Technical', keywords: ['waste', 'recycling', 'disposal', 'bins'] }
    ]
  },
  {
    id: 'it_digital',
    name: 'IT & Digital',
    description: 'Computer skills and digital literacy',
    skills: [
      { id: 'basic_computer', name: 'Basic Computer Skills', category: 'it_digital', type: 'Technical', level: 'Basic', keywords: ['computer', 'basic', 'typing', 'mouse'] },
      { id: 'cv_writing', name: 'CV Writing', category: 'it_digital', type: 'Technical', keywords: ['cv', 'resume', 'writing', 'applications'] },
      { id: 'microsoft_office', name: 'Microsoft Office (Word, Excel, PowerPoint)', category: 'it_digital', type: 'Technical', keywords: ['microsoft', 'office', 'word', 'excel', 'powerpoint'] },
      { id: 'email_internet', name: 'Email & Internet Use', category: 'it_digital', type: 'Technical', level: 'Basic', keywords: ['email', 'internet', 'web', 'browsing'] },
      { id: 'digital_marketing', name: 'Digital Marketing Basics', category: 'it_digital', type: 'Technical', keywords: ['digital marketing', 'social media', 'online'] },
      { id: 'graphic_design', name: 'Graphic Design (Canva/Figma)', category: 'it_digital', type: 'Technical', keywords: ['graphic design', 'canva', 'figma', 'visual'] },
      { id: 'coding_beginner', name: 'Coding (Beginner)', category: 'it_digital', type: 'Technical', level: 'Basic', keywords: ['coding', 'programming', 'beginner'] },
      { id: 'social_media', name: 'Social Media Management', category: 'it_digital', type: 'Technical', keywords: ['social media', 'facebook', 'instagram', 'twitter'] }
    ]
  },
  {
    id: 'trades_technical',
    name: 'Trades & Technical',
    description: 'Skilled trades and technical work',
    skills: [
      { id: 'plumbing_basic', name: 'Plumbing (Basic)', category: 'trades_technical', type: 'Technical', level: 'Basic', keywords: ['plumbing', 'pipes', 'water', 'basic'] },
      { id: 'electrical_assistance', name: 'Electrical Assistance', category: 'trades_technical', type: 'Technical', keywords: ['electrical', 'assistant', 'wiring', 'helper'] },
      { id: 'carpentry_basic', name: 'Carpentry (Basic)', category: 'trades_technical', type: 'Technical', level: 'Basic', keywords: ['carpentry', 'wood', 'basic', 'joinery'] },
      { id: 'handyperson', name: 'Handyperson', category: 'trades_technical', type: 'Technical', keywords: ['handyman', 'maintenance', 'repair', 'general'] },
      { id: 'pat_testing', name: 'PAT Testing', category: 'trades_technical', type: 'Certification', keywords: ['pat testing', 'electrical', 'safety', 'appliance'] },
      { id: 'decorating', name: 'Decorating', category: 'trades_technical', type: 'Technical', keywords: ['decorating', 'painting', 'wallpaper'] },
      { id: 'welding', name: 'Welding', category: 'trades_technical', type: 'Technical', keywords: ['welding', 'metal', 'fabrication'] },
      { id: 'hvac_assistance', name: 'HVAC Assistance', category: 'trades_technical', type: 'Technical', keywords: ['hvac', 'heating', 'cooling', 'assistant'] }
    ]
  },
  {
    id: 'retail_customer',
    name: 'Retail & Customer Service',
    description: 'Sales, retail and customer service skills',
    skills: [
      { id: 'shelf_stacking', name: 'Shelf Stacking', category: 'retail_customer', type: 'Technical', keywords: ['shelf', 'stacking', 'merchandising', 'retail'] },
      { id: 'till_operation', name: 'Till Operation', category: 'retail_customer', type: 'Technical', keywords: ['till', 'cash register', 'pos', 'checkout'] },
      { id: 'stock_replenishment', name: 'Stock Replenishment', category: 'retail_customer', type: 'Technical', keywords: ['stock', 'replenishment', 'inventory', 'shelves'] },
      { id: 'sales_assistance', name: 'Sales Assistance', category: 'retail_customer', type: 'Technical', keywords: ['sales', 'assistant', 'customer', 'help'] },
      { id: 'customer_support', name: 'Customer Support', category: 'retail_customer', type: 'Soft Skill', keywords: ['customer support', 'help', 'service'] },
      { id: 'merchandising', name: 'Merchandising', category: 'retail_customer', type: 'Technical', keywords: ['merchandising', 'display', 'visual', 'retail'] },
      { id: 'call_centre', name: 'Call Centre Operation', category: 'retail_customer', type: 'Technical', keywords: ['call centre', 'phone', 'customer service'] },
      { id: 'complaint_handling', name: 'Complaint Handling', category: 'retail_customer', type: 'Soft Skill', keywords: ['complaints', 'resolution', 'customer service'] }
    ]
  },
  {
    id: 'soft_skills',
    name: 'Skills & Personal Development',
    description: 'Essential soft skills and personal attributes',
    skills: [
      { id: 'time_management', name: 'Time Management', category: 'soft_skills', type: 'Soft Skill', keywords: ['time', 'management', 'organization', 'planning'] },
      { id: 'teamwork', name: 'Teamwork', category: 'soft_skills', type: 'Soft Skill', keywords: ['teamwork', 'collaboration', 'cooperation'] },
      { id: 'communication', name: 'Communication', category: 'soft_skills', type: 'Soft Skill', keywords: ['communication', 'speaking', 'listening'] },
      { id: 'problem_solving', name: 'Problem Solving', category: 'soft_skills', type: 'Soft Skill', keywords: ['problem solving', 'analytical', 'solutions'] },
      { id: 'conflict_resolution', name: 'Conflict Resolution', category: 'soft_skills', type: 'Soft Skill', keywords: ['conflict', 'resolution', 'mediation'] },
      { id: 'leadership', name: 'Leadership', category: 'soft_skills', type: 'Soft Skill', keywords: ['leadership', 'management', 'guidance'] },
      { id: 'adaptability', name: 'Adaptability', category: 'soft_skills', type: 'Soft Skill', keywords: ['adaptability', 'flexibility', 'change'] },
      { id: 'punctuality', name: 'Punctuality', category: 'soft_skills', type: 'Soft Skill', keywords: ['punctuality', 'timing', 'reliability'] },
      { id: 'resilience', name: 'Resilience', category: 'soft_skills', type: 'Soft Skill', keywords: ['resilience', 'perseverance', 'strength'] },
      { id: 'reliability', name: 'Reliability', category: 'soft_skills', type: 'Soft Skill', keywords: ['reliability', 'dependability', 'trust'] }
    ]
  }
];

// Utility functions for skill management
export const getAllSkills = (): Skill[] => {
  return skillsDatabase.flatMap(category => category.skills);
};

export const getSkillsByCategory = (categoryId: string): Skill[] => {
  const category = skillsDatabase.find(cat => cat.id === categoryId);
  return category ? category.skills : [];
};

export const searchSkills = (query: string): Skill[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllSkills().filter(skill => 
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
};

export const getSkillById = (skillId: string): Skill | undefined => {
  return getAllSkills().find(skill => skill.id === skillId);
};

export const getSkillsByType = (type: Skill['type']): Skill[] => {
  return getAllSkills().filter(skill => skill.type === type);
};

export const getRelatedSkills = (skillId: string): Skill[] => {
  const skill = getSkillById(skillId);
  if (!skill || !skill.relatedSkills) return [];
  
  return skill.relatedSkills
    .map(relatedId => getSkillById(relatedId))
    .filter((s): s is Skill => s !== undefined);
};

export const getCategoriesByJobCategory = (jobCategory: string): string[] => {
  const categoryMap: Record<string, string[]> = {
    'Construction': ['construction', 'trades_technical'],
    'Manufacturing': ['trades_technical', 'soft_skills'],
    'Transportation': ['driving_logistics', 'soft_skills'],
    'Retail': ['retail_customer', 'soft_skills'],
    'Hospitality': ['catering_hospitality', 'soft_skills'],
    'Healthcare': ['soft_skills', 'cleaning_maintenance'],
    'Service Industry': ['soft_skills', 'retail_customer'],
    'Maintenance': ['cleaning_maintenance', 'trades_technical'],
    'Logistics': ['driving_logistics', 'soft_skills'],
    'Agriculture': ['soft_skills', 'trades_technical']
  };
  
  return categoryMap[jobCategory] || ['soft_skills'];
};
