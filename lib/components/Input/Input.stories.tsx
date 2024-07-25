import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

export default {
  title: "Example/Input",
  component: Input,
} as Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {},
};
