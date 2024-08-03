export interface TsMaskOptions {
  rulesMask?: MaskRules;
  rulesMoney?: MaskMoneyRules;
}

export interface MaskMoneyRules {
  thousands: string;
  decimal: string;
  precision: number;
  beforeMaskMoney?: (value: number) => number;
  afterMaskMoney?: (value: string) => string;
}

export interface MaskRules {
  map: Map<string, MaskOptions>;
  beforeMask?: (value: string) => string;
  afterMask?: (value: string) => string;
}

export interface MaskOptions {
  pattern: RegExp;
  transform?: (
    prevValue: string,
    newChar: string
  ) => { prevValue: string; newChar: string };
}
