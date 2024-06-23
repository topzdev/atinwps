import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "@/lib/utils"
import {ButtonProps, iconSizes, variants} from "./button";
const iconButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            size: {
                sm: "h-[32px] min-w-[32px] rounded-md md:text-sm ",
                base: "h-[40px] min-w-[40px] rounded-md text-lg",
                lg: "h-[48px] min-w-[48px] rounded-md text-md",
                xl: "h-[55px] min-w-[55px] rounded-md text-lg",
            },

            rounded: {
                true: '!rounded-full',
                false: '',
            }
        },


        defaultVariants: {
            size: "base",
            rounded: false,
        },
    }
)
export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof iconButtonVariants> & Pick<ButtonProps, 'size' | 'variant' | 'color' | 'asChild'>



const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({
         children,
         className,
         rounded,
         variant = 'text',
         color = 'accent',
         size = 'base',
         asChild = false,
         ...props
     }, ref) => {
        const Comp = asChild ? Slot : "button"
        const style = variants[color][variant];
        const iconSize = iconSizes[size ? size : 'base'];
        return (
            <Comp
                className={cn(style, iconButtonVariants({size, rounded}), iconSize, className)}
                ref={ref}
                {...props}
            >
                {children}
            </Comp>
        )
    }
)
IconButton.displayName = "IconButton"

export {IconButton, iconButtonVariants}