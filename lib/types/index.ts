import { MaskType } from "../enums";

export interface MaskProps {
  value: string;
  mask: string;
  rules?: Map<string, RegExp>;
}

export interface UnmaskProps {
  value: string;
}

export interface GetMaskProps {
  value: string;
  type: MaskType;
}
