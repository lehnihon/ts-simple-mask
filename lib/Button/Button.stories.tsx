import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "ts-simple-mask";

export default {
  title: "Example/Button",
  component: Button,
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me!",
  },
};

export const Emoji: Story = {
  args: {
    children: ":)",
  },
};
