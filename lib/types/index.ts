export interface TsMaskOptions {
  rulesMask?: Map<string, MaskOptions>;
  rulesMoney?: MaskMoneyRules;
}

export interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
  prefix?: string;
  suffix?: string;
}

export interface MaskOptions {
  pattern: RegExp;
  transform?: (char: string) => string;
  validate?: (value: string) => boolean;
}
