import { render } from "@testing-library/react";
import { Button } from "ts-simple-mask";

describe(`Component: ${Button.name}`, () => {
  it("should render", () => {
    const { container } = render(<Button>My button</Button>);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <button>
          My button
        </button>
      </div>
    `);
  });
});
