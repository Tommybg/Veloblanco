
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const geometricButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:animate-skew-hover hover:shadow-geometric-hover",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-geometric rounded-asymmetric",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-geometric rounded-skewed",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-inner-geometric rounded-asymmetric",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-geometric rounded-skewed",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-asymmetric",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
        geometric: "bg-geometric-primary text-white hover:bg-geometric-accent shadow-geometric rounded-3xl hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        geometric: "h-12 px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GeometricButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof geometricButtonVariants> {
  asChild?: boolean
}

const GeometricButton = React.forwardRef<HTMLButtonElement, GeometricButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(geometricButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GeometricButton.displayName = "GeometricButton"

export { GeometricButton, geometricButtonVariants }
