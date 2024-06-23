import React from "react";
import InputWrapper, {InputWrapperProps, InputWrapperSkeleton} from "@/components/ui/input-wrapper";
import Typography from "@/components/ui/typography";
import Image from "next/image";
import {RadioGroup, RadioGroupItem, RadioGroupProps} from "@/components/ui/radio-group";
import {Controller} from "react-hook-form";
import {Skeleton} from "@/components/ui/skeleton";
import {InputProps} from "@/components/ui/input";

type ChooserItem = {
    title: string,
    image: string,
    value: string,
}

type ItemChooserProps = {
    children?: React.ReactNode,
    items: ChooserItem[]
} & InputWrapperProps & RadioGroupProps;



const ItemChooser = ({children, className, error, hint, label, id, items, ...props}: ItemChooserProps) => {
    const inputWrapperProps = {className, error, hint, label, id};
    return <InputWrapper {...inputWrapperProps}>
        <RadioGroup   {...props} className={'flex flex-row gap-x-4'}>
            {items.map(item =>
                <RadioGroupItem key={item.value} showIndicator={false}
                                className="flex items-center flex-col text-inherit border-0 min-w-[150px] h-auto gap-y-2 data-[state=checked]:text-primary group"
                                value={item.value.toString()} id={item.value.toString()}>
                    <div
                        className={'h-full w-full rounded-2xl border-transparent border-[3px] overflow-hidden relative min-h-[150px] group-data-[state=checked]:border-primary'}>
                        <Image src={item.image}
                               fill
                               alt={item.title}
                               style={{
                                   objectFit: 'cover', // cover, contain, none
                               }}
                        />
                    </div>
                    <Typography variant={'small'}>{item.title}</Typography>
                </RadioGroupItem>
            )}
        </RadioGroup>
    </InputWrapper>
}


type ControlledProp = {
    control: any;
    name: string;
} & ItemChooserProps;
export const FormItemChooser = ({name, control, ...props}: ControlledProp) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field: {ref, ...field}, fieldState, formState}) => (
                <ItemChooser
                    {...props}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    error={fieldState.error?.message}
                />
            )}
        />
    );
};

export const ItemChooserSkeleton = ({}: InputProps) => {
    return <InputWrapperSkeleton>
        <div className={'flex flex-row gap-x-4'}>
            <Skeleton className={'w-[150px] min-h-[150px] rounded-2xl'} />
            <Skeleton className={'w-[150px] min-h-[150px] rounded-2xl'} />
        </div>
    </InputWrapperSkeleton>
}
export default ItemChooser;
