import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "link";

type ButtonProps = {
  variant?: Variant;
} & ComponentProps<"button">;

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button
    {...props}
    className={twMerge("transition-colors rounded px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed", getVariantStyles(variant), className)} />;
}

function getVariantStyles(variant: Variant) {
  switch (variant) {
    case "primary":
      return "bg-orange-600 hover:bg-orange-500";
    case "secondary":
      return "bg-zinc-700 hover:bg-zinc-600 text-zinc-200";
    case "link":
      return "p-0 text-left text-orange-400 hover:text-orange-300 hover:underline";

    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`);
  }
}
