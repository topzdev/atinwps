import React from 'react';
import PhotoEditor from "@/app/_components/PhotoEditor";
import Typography from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import FacebookPagePreview from "@/app/_components/FacebookPagePreview";
import {Metadata} from "next";
import ShareSocMed from "@/app/_components/ShareSocMed";
import Footer from "@/app/_components/Footer";

interface Frame {
    id: string;
    url: string;
    name: string;
}

export const metadata: Metadata = {
    title: '#AtinAngWestPhilippineSea',
    description: 'More than 500 people have joined the cause! Join now by adding a frame to your photo on social media!',
    openGraph: {
        images: ['/atin-wps-seo-cover.jpg']
    }
}

const App: React.FC = () => {

    return (
        <div className={'flex flex-col text-center items-center py-5 md:py-10 pb-14 max-w-[500px] mx-auto max-lg:px-4'}>
            <Link className={'mb-2'} target={'_blank'} href={'https://www.facebook.com/atinwps'}>
                <Image width={100} height={100} src={'/logo.png'} alt={'AtinAngWestPhilippineSea Logo'}/>
            </Link>
            <Typography variant='h2' style={{}} className={''}>#AtinAngWestPhilippineSea</Typography>
            <Typography variant='p-ui' className='mt-2'>More than 500 people have joined the cause! Join now by
                adding a
                frame to your photo on social media!</Typography>

            <PhotoEditor/>

            <Typography className={'mt-3 mb-2'}>Follow us on Facebook for the latest updates about WPS issues.</Typography>
            <FacebookPagePreview/>
            <ShareSocMed/>
            <Footer/>
        </div>
    );
};

export default App;