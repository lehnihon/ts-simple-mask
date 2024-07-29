import React, { ReactNode, useState } from "react";
import { maskMoney } from "ts-simple-mask";

export const Input = (): ReactNode => {
  const [value, setValue] = useState("");
  const simpleMask = maskMoney(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = maskMoney(e.target.value);
    setValue(simpleMask.unmasked);
  };

  return (
    <input type="text" value={simpleMask.masked} onChange={handleChange} />
  );
};
