import { ReactNode, useState } from "react";
import { getMask, mask } from "../../utils";
import { MaskType } from "../../enums";

export const Input = (): ReactNode => {
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    const simpleMask = mask({
      value: e.target.value,
      mask: getMask({ value: e.target.value, type: MaskType.DOCUMENT_BR }),
    });
    setValue(simpleMask.masked);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};
