import React, {useEffect, useState} from "react";
import InputWrapper, {InputWrapperProps, InputWrapperSkeleton} from "@/components/ui/input-wrapper";
import {Input, InputProps, InputSkeleton} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Controller} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

type ColorPickerProps = {
    children?: React.ReactNode,
    onChange?: (color: string) => void;
} & InputWrapperProps & Omit< InputProps, 'onChange'>;

const defaultSolidColors = [
    '#000',
    '#fff',
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
];
const ColorPicker = ({
                         label,
                         error,
                         hint,
                         className,
                         value,
                         onChange,
                         ...props
                     }: ColorPickerProps) => {

    const [color, setColor] = useState((value as string) || '#000');
    const inputWrapperProps = {id: props.id, error, hint, label}
    const [popover, setPopover] = useState(false);

    useEffect(() => {
        setColor(value as string);
    }, [value]);

    const pickColor = (color: string) => {
        setColor(color);
        setPopover(false);
        if (onChange) onChange(color);
    }

    return <InputWrapper className={cn('flex w-full', className)} {...inputWrapperProps}>
        <div className="flex gap-x-2 md:gap-x-2.5">
            <Popover open={popover} onOpenChange={setPopover}>
                <PopoverTrigger>
                    <div style={{
                        background: color,
                    }} className={'min-h-[48px] w-[48px] min-w-[48px] md:min-h-[52px] md:w-[52px] md:min-w-[52px] rounded-2xl border border-border'}>
                    </div>
                </PopoverTrigger>
                <PopoverContent align={'start'}>
                    <div className="grid grid-cols-12 gap-2">
                        {defaultSolidColors.map(item => <div
                            key={item}
                            onClick={() => pickColor(item)}
                            style={{
                                background: item,
                            }}
                            className={cn('col-span-2 aspect-square rounded cursor-pointer border', color === item ? 'border-2 border-primary' : '')}></div>)}
                    </div>
                </PopoverContent>
            </Popover>

            <Input className="w-full" type={'hex'} value={color} error={error} onChange={(e) => pickColor(e.target.value)}/>
        </div>
    </InputWrapper>
}

type ControlledProp = {
    control: any;
    name: string;
} & ColorPickerProps;

export const FormColorPicker = ({name, control, ...props}: ControlledProp) => {
    return <Controller name={name} control={control} render={({field: {ref, ...field}, fieldState}) => (
        <ColorPicker
            {...props}
            {...field}
            error={fieldState.error?.message}
        />
    )}>
    </Controller>
}

export const ColorPickerSkeleton = () => {
    return <InputWrapperSkeleton>
        <div className="flex gap-x-2.5">
            <Skeleton className="min-h-[52px] w-[52px] min-w-[52px]">
            </Skeleton>
            <Skeleton className={'h-[48px] md:h-[52px] rounded-2xl w-full'}/>
        </div>
    </InputWrapperSkeleton>
}

export default ColorPicker;