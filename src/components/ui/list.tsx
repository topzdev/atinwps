import React from "react";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";

type ListProps = {
    children?: React.ReactNode
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>

const List = React.forwardRef<HTMLUListElement, ListProps>(({className, children, ...props}, ref) => {
    {
        return <ul className={cn('flex flex-col relative', className)} {...props} ref={ref}>
            {children}
        </ul>
    }
})

List.displayName = 'List';

type ListGroupProps = {
    children: React.ReactNode,
    groupTitle: string,
}

export const ListGroup = ({groupTitle, children}: ListGroupProps) => {
    return <li>
        <ul>
            {groupTitle && <li className="sticky top-0 bg-white py-2">
                <Typography variant="overline" className={'font-bold'}>{groupTitle}</Typography>
            </li>
            }
            {children}
        </ul>
    </li>
}

export type ListItemProps = {
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
    selected?: boolean;
} & React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(({
                                                                            className,
                                                                            leftAdornment,
                                                                            rightAdornment,
                                                                            children,

                                                                            selected,
                                                                            ...props
                                                                        }, ref) => {
    return <li
        className={cn('flex items-center text-foreground-primary hover:bg-slate-100 rounded-lg px-2 md:px-3 py-2 md:py-2.5 cursor-pointer select-none', selected ? 'bg-primary-100 hover:bg-primary-100 text-primary' : '', className)} {...props}
        ref={ref}>
        {leftAdornment && <div className={'flex items-center'}>{leftAdornment}</div>}
        {children}
        {rightAdornment && <div className={'flex items-center'}>{rightAdornment}</div>}
    </li>
})

export const ListItemSkeleton = () => {
    return <li className={'flex w-full gap-x-2'}>
        <Skeleton className={'h-[38px] w-[48px] rounded-2xl'}/>
        <Skeleton className={'h-[38px] w-1/3 rounded-2xl'}/>
        <Skeleton className={'h-[38px] w-[48px] rounded-2xl ml-auto'}/>
    </li>
}

ListItem.displayName = 'ListItem';

export default List;