export interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
  prefix?: string;
  suffix?: string;
}

export interface MaskOptions {
  pattern: RegExp;
  transform?: (value: string) => string;
}
