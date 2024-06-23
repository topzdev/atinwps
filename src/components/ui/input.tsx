import * as React from 'react';

import {cn} from '@/lib/utils';
import {Controller} from 'react-hook-form';
import InputWrapper, {InputWrapperProps, InputWrapperSkeleton} from "@/components/ui/input-wrapper";
import {Skeleton} from "@/components/ui/skeleton";

export const inputStyling = ({error}: Pick<InputProps, 'error'>) => {
    return [
        'flex border border-slate-100 bg-slate-100 w-full rounded-2xl px-3.5 md:px-5 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base',
        error && 'bg-red-100 border-red-500 !ring-red-500'
    ]
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    inputClassName?: string,
    type?: Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type'> | 'hex',
    leftAdornment?: React.ReactNode,
    rightAdornment?: React.ReactNode
} & InputWrapperProps

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
         label,
         error,
         hint,
         className,
         inputClassName,
         type,
         onKeyDown,
         leftAdornment,
         rightAdornment,
         ...props
     }, ref) => {

        const inputWrapperProps = {id: props.id, error, hint, className, label}

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

            if (onKeyDown) {
                onKeyDown(e)
            } else {
                if (type === 'hex') {
                    const char = e.key;
                    const hexRegex = /^[0-9a-fA-F#]$/;

                    // Allow control keys: backspace, delete, tab, arrow keys, etc.
                    const controlKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

                    if (!hexRegex.test(char) && !controlKeys.includes(char)) {
                        e.preventDefault(); // Prevent the character from being entered
                    }
                }
            }

        };

        return (
            <InputWrapper {...inputWrapperProps}>
                <div className={cn(
                    inputStyling({error}),
                    'h-[48px] md:h-[52px] md:px-5 !py-0 gap-x-1.5 items-center',
                    inputClassName
                )}>
                    {leftAdornment && <span className={'text-2xl'}>{leftAdornment}</span>}
                    <input
                        type={type}
                        className={'w-full !outline-0 bg-transparent h-full py-3'}
                        ref={ref}
                        {...props}
                        onKeyDown={handleKeyDown}
                    />
                    {rightAdornment&& <span className={'text-2xl'}>{rightAdornment}</span>}
                </div>
            </InputWrapper>
        );
    }
);

type ControlledProp = {
    control: any;
    name: string;
} & InputProps;
export const FormInput = ({name, control, ...props}: ControlledProp) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field: {ref, ...field}, fieldState}) => (
                <Input
                    {...props}
                    {...field}
                    error={fieldState.error?.message}
                />
            )}
        />
    );
};

export const InputSkeleton = ({}: InputProps) => {
    return <InputWrapperSkeleton>
        <Skeleton className={'h-[48px] md:h-[52px] rounded-2xl w-full'}/>
    </InputWrapperSkeleton>
}

Input.displayName = 'Input';

export {Input};
