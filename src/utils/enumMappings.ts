
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
  'mobility_physical_access': 'mobility_physical',
  'sensory_hearing_vision_processing': 'sensory_hearing_vision',
  'long_term_medical_condition': 'long_term_medical',
  'neurodivergence': 'neurodivergence',
  'learning_difficulty': 'learning_difficulty',
  'mental_health': 'mental_health',
  'communication_needs': 'communication_needs',
  'cognitive_memory_difficulties': 'cognitive_memory',
  'other': 'other',
  'prefer_not_to_specify': 'prefer_not_to_specify'
};

export const convictionTypeMapping = {
  'theft_burglary_robbery': 'theft_burglary_robbery',
  'fraud_financial_offences': 'fraud_financial',
  'drug_offences_possession': 'drug_possession',
  'drug_offences_supply': 'drug_supply_production',
  'drug_offences_production': 'drug_supply_production',
  'driving_offences': 'driving_offences',
  'assault_violent_offences': 'assault_violent',
  'sexual_offences': 'sexual_offences',
  'public_order_offences': 'public_order_offences',
  'domestic_abuse_related': 'domestic_abuse',
  'terrorism_related_offences': 'terrorism_related_offences',
  'weapons_offences': 'weapons_offences',
  'harassment_stalking': 'harassment_stalking',
  'arson': 'arson',
  'breach_court_orders': 'breach_court_orders',
  'other': 'other'
};

export const workPreferenceMapping = {
  'full_time': 'full_time',
  'part_time': 'part_time',
  'contract': 'contract',
  'temporary': 'temporary',
  'flexible_hours': 'flexible_hours',
  'remote_work': 'remote_work',
  'shift_work': 'shift_work',
  'zero_hours': 'zero_hours',
  'weekends': 'weekends',
  'nights': 'nights'
};

export const mapWorkplaceAdjustments = (adjustments: string[]): string[] => {
  return adjustments.map(adj => workplaceAdjustmentMapping[adj as keyof typeof workplaceAdjustmentMapping] || adj);
};

export const mapDisabilityTypes = (types: string[]): string[] => {
  return types.map(type => disabilityTypeMapping[type as keyof typeof disabilityTypeMapping] || type);
};

export const mapConvictionTypes = (types: string[]): string[] => {
  return types.map(type => convictionTypeMapping[type as keyof typeof convictionTypeMapping] || type);
};

export const mapWorkPreferences = (preferences: string[]): string[] => {
  return preferences.map(pref => workPreferenceMapping[pref as keyof typeof workPreferenceMapping] || pref);
};
