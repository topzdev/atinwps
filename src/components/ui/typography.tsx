import React from "react";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

export type TypographyProps = {
    children?: React.ReactNode,
    variant?: keyof typeof typographies;
    className?: string,
    as?: keyof JSX.IntrinsicElements;
    foreground?: keyof typeof foregrounds
} & React.DetailedHTMLProps<React.HTMLAttributes<any>, any>
const typographies = {
    h1: {className: 'typo-h1', element: 'h1'},
    h2: {className: 'typo-h2', element: 'h2'},
    h3: {className: 'typo-h3', element: 'h3'},
    h4: {className: 'typo-h4', element: 'h4'},
    p: {className: 'typo-p', element: 'p'},
    'p-ui': {className: 'typo-p-ui', element: 'p'},
    body: {className: 'typo-body', element: 'p'},
    'body-medium': {className: 'typo-body-medium', element: 'p'},
    small: {className: 'typo-small', element: 'p'},
    detail: {className: 'typo-detail', element: 'p'},
    blockqoute: {className: 'typo-blockqoute', element: 'blockqoute'},
    list: {className: 'typo-list', element: 'p'},
    code: {className: 'typo-code', element: 'code'},
    lead: {className: 'typo-lead', element: 'p'},
    large: {className: 'typo-large', element: 'p'},
    overline: {className: 'typo-overline', element: 'p'},
    subtitle: {className: 'typo-subtitle', element: 'p'}
};

const foregrounds = {
    inherit: '',
    primary: 'text-foreground-primary',
    secondary: 'text-foreground-secondary',
    disabled: 'text-foreground-disabled',
}

const Typography = ({
                        as: Element,
                        variant = 'p',
                        foreground = 'inherit',
                        children,
                        className,
                        ...props
                    }: TypographyProps) => {
    const as = Element ? Element : typographies[variant]['element'];
    const elementStyle = typographies[variant]['className'];
    const foregroundStyle = foregrounds[foreground];
    const TypographyComponent = React.createElement(as, {
        className: cn(elementStyle, foregroundStyle, className),
        ...props
    }, children);
    return TypographyComponent;

}

export const TypographySkeleton = ({...props}: TypographyProps) => {
    return <Skeleton className={'w-auto'}>
        <Typography {...props} className="opacity-0 select-none"></Typography>
    </Skeleton>
}


export default Typography;