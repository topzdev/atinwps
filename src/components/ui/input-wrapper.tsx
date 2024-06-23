import React from "react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import Typography from "@/components/ui/typography";
import {Skeleton} from "@/components/ui/skeleton";

export type InputWrapperProps = {
    children?: React.ReactNode,
    className?: string,
    error?: string | boolean;
    hint?: string,
    label?: string,
    id?: string,
}

const InputWrapper = ({className, error, hint, label, children, id}: InputWrapperProps) => {
    return <div className={cn('flex flex-col gap-y-1.5', className)}>
        {label && <Label htmlFor={id}>{label}</Label>}

        {children}

        {error && (
            <Typography
                variant='detail'
                className='text-red-500'
            >
                {error}
            </Typography>
        )}
        {!error && hint && (
            <Typography
                variant='detail'
                foreground='secondary'
            >
                {hint}
            </Typography>
        )}
    </div>
}

export const InputWrapperSkeleton = ({children}: InputWrapperProps) => {
    return <div className={cn('flex flex-col w-full gap-y-1')}>
        <Skeleton className="h-5 max-w-[160px] rounded-2xl" />
        {children}
    </div>
}

export default InputWrapper;