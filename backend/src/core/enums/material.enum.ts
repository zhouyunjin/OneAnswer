export enum MaterialType {
  HOT_METAL = 'hot_metal',
  LIQUID_STEEL = 'liquid_steel',
  ALLOY = 'alloy',
  AUXILIARY_MATERIAL = 'auxiliary_material',
}

export enum ProcessType {
  CONVERTER = 'converter',
  LF_FURNACE = 'lf_furnace',
  CONTINUOUS_CASTING = 'continuous_casting',
}

export enum EquipmentStatus {
  RUNNING = 'running',
  IDLE = 'idle',
  MAINTENANCE = 'maintenance',
  FAULT = 'fault',
}

export enum AlarmSeverity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  INFO = 'info',
}

export enum AlarmStatus {
  UNRESOLVED = 'unresolved',
  RESOLVED = 'resolved',
  ACKNOWLEDGED = 'acknowledged',
}
