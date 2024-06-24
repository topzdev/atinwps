"use client";
import React from "react";
import Typography from "@/components/ui/typography";
import {
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton, TelegramIcon, TelegramShareButton,
    TwitterShareButton,
    XIcon
} from 'react-share';

type Props = {
    children?: React.ReactNode
}

const PAGE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL|| '';
const ShareSocMed = (props: Props) => {
    return <div className="flex flex-col">
        <div className={'flex fixed bottom-0 left-1/2 -translate-x-1/2 items-center'}>
            <Typography className={'px-2 py-2 text-white font-bold text-start bg-gradient-to-r from-blue-600 to-red-600 h-full'} variant={'p-ui'}>
                Please <br/>
                Share
            </Typography>
            <FacebookShareButton url={PAGE_URL}>
                <FacebookIcon/>
            </FacebookShareButton>
            <TwitterShareButton url={PAGE_URL}>
                <XIcon/>
            </TwitterShareButton>
            <RedditShareButton url={PAGE_URL}>
                <RedditIcon/>
            </RedditShareButton>
            <TelegramShareButton url={PAGE_URL}>
                <TelegramIcon/>
            </TelegramShareButton>
        </div>
    </div>
}

export default ShareSocMed;