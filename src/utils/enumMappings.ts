
// Frontend to database enum mappings to prevent database errors

export const workplaceAdjustmentMapping = {
  'flexible_working_hours': 'flexible_hours',
  'remote_work_option': 'remote_work',
  'additional_training_support': 'training_support',
  'assistive_technology': 'assistive_technology',
  'modified_physical_work_environment': 'modified_environment',
  'communication_support': 'communication_support',
  'none': 'none'
};

export const disabilityTypeMapping = {
  'mobility_physical_access': 'mobility_physical_access',
  'sensory_hearing_vision_processing': 'sensory_hearing_vision_processing',
  'long_term_medical_condition': 'long_term_medical_condition',
  'neurodivergence': 'neurodivergence',
  'learning_difficulty': 'learning_difficulty',
  'mental_health': 'mental_health',
  'communication_needs': 'communication_needs',
  'cognitive_memory_difficulties': 'cognitive_memory_difficulties',
  'other': 'other',
  'prefer_not_to_specify': 'prefer_not_to_specify'
};

export const mapWorkplaceAdjustments = (adjustments: string[]): string[] => {
  return adjustments.map(adj => workplaceAdjustmentMapping[adj as keyof typeof workplaceAdjustmentMapping] || adj);
};

export const mapDisabilityTypes = (types: string[]): string[] => {
  return types.map(type => disabilityTypeMapping[type as keyof typeof disabilityTypeMapping] || type);
};
