import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium font-urbanist ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-figma hover:shadow-figma-card",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-figma hover:shadow-figma-card",
        outline:
          "border border-border bg-card text-card-foreground hover:bg-accent hover:border-border shadow-figma hover:shadow-figma-card",
        secondary:
          "bg-civic-gray-100 text-civic-gray-500 hover:bg-civic-gray-200 hover:text-civic-gray-900 shadow-figma hover:shadow-figma-card",
        ghost: "hover:bg-civic-gray-100 hover:text-civic-gray-900",
        link: "text-primary underline-offset-4 hover:underline",
        // Figma-specific variants
        figma_primary: "bg-civic-gray-900 text-white hover:bg-civic-gray-900/90 shadow-figma hover:shadow-figma-card rounded-2xl",
        figma_secondary: "bg-card border border-border text-card-foreground hover:bg-accent hover:border-border shadow-figma hover:shadow-figma-card rounded-2xl",
        success: "bg-civic-accent-green text-white hover:bg-civic-accent-green/90 shadow-figma hover:shadow-figma-card",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }