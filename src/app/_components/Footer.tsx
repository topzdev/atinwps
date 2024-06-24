"use client"
import React from "react";
import Typography from "@/components/ui/typography";
import Link from "next/link";

type Props = {
    children?: React.ReactNode
}

const Footer = (props: Props) => {
    return <Typography className={'pb-10 py-5'}>
        Made by <b><Link href={'https://topz.dev/'} target={'_blank'}>Christopher Lugod</Link></b>
    </Typography>
}

export default Footer;