import React, { ReactNode, useState } from "react";
import { getMask, mask } from "../../utils";
import { MaskType } from "../../enums";

export const Input = (): ReactNode => {
  const [value, setValue] = useState("");
  const type = MaskType.DOCUMENT_BR;
  const simpleMask = mask(value, getMask(value, type));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = mask(e.target.value, getMask(e.target.value, type));
    setValue(simpleMask.unmasked.toUpperCase());
  };

  return (
    <input type="text" value={simpleMask.masked} onChange={handleChange} />
  );
};
