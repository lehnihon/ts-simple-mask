import React from "react";
import { mask } from "ts-simple-mask";

export const Input = () => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const simpleMask = mask(e.target.value, "00/00/0000");
    setValue(simpleMask.masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
