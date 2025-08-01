import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid items-start gap-1",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-destructive/50 text-destructive [&>svg]:text-destructive bg-destructive/10",
        success: "border-success/50 text-success [&>svg]:text-success bg-success/10",
        warning: "border-warning/50 text-warning [&>svg]:text-warning bg-warning/10",
        info: "border-info/50 text-info [&>svg]:text-info bg-info/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          // Conditional grid layout when icon is present
          "has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertIcon = ({ className, ...props }) => (
  <div className={cn("row-span-2 self-center", className)} {...props} />
);
AlertIcon.displayName = "AlertIcon";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertIcon, AlertTitle, AlertDescription };