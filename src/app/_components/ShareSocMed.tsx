"use client";
import React from "react";
import Typography from "@/components/ui/typography";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton, LinkedinIcon, LinkedinShareButton,
    RedditIcon,
    RedditShareButton, TelegramIcon, TelegramShareButton,
    TwitterShareButton, WhatsappIcon, WhatsappShareButton,
    XIcon
} from 'react-share';

type Props = {
    children?: React.ReactNode
}

const PAGE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL|| '';
const ShareSocMed = (props: Props) => {
    return <div className="flex flex-col text-center justify-center">
        <Typography className={'px-2 py-2 h-full'} variant={'p-ui'}>
            Also, please help us spread this cause through sharing on social media.
        </Typography>
        <div className={'flex items-center flex-wrap justify-center mx-auto'}>
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
            <WhatsappShareButton url={PAGE_URL}>
                <WhatsappIcon/>
            </WhatsappShareButton>
            <LinkedinShareButton url={PAGE_URL}>
                <LinkedinIcon/>
            </LinkedinShareButton>
            <EmailShareButton url={PAGE_URL}>
                <EmailIcon/>
            </EmailShareButton>
        </div>
    </div>
}

export default ShareSocMed;