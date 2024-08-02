export interface TsMaskOptions {
  rulesMask?: Map<string, MaskOptions>;
  rulesMoney?: MaskMoneyRules;
}

export interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
}

export interface MaskOptions {
  pattern: RegExp;
  transform?: (char: string) => string;
  validate?: (value: string) => boolean;
}
