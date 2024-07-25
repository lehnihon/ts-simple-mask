import { ReactNode } from "react";
import { mask } from "../utils";

interface ButtonProps {
  children: ReactNode;
}

export const Button = ({ children }: ButtonProps): ReactNode => {
  const RULES = new Map([
    ["S", /[A-Za-z]/],
    ["0", /\d/],
    ["A", /a-zA-Z0-9/],
  ]);
  const masked = mask({
    value: "19232334000119",
    mask: "00.000.000/0000-00",
    rules: RULES,
  });
  console.log("MASKED", masked);

  return <button>{children}</button>;
};
