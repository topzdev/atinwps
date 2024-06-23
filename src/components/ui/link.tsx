"use client"
import React from "react";
import {usePathname} from "next/navigation";
import Link, {LinkProps} from "next/link";
import useIsActivePage from "@/hooks/useIsActivePage";

export type ActiveLinkProps = {
    children?: React.ReactNode;
    activeClassName?: string;
    className?: string;
} & LinkProps

export const AppActiveLink = ({children, activeClassName, className, ...props}: ActiveLinkProps) => {
    const isActivePage = useIsActivePage({href: props.href, as: props.as});

    if (isActivePage) {
        className = `${className} ${activeClassName}`.trim();
    }
    return <Link className={className} {...props}>
        {children}
    </Link>;
};

const AppLink = Link;


export default AppLink;