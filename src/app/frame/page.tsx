"use client"

import React, { useState } from 'react';
import PhotoEditor from "@/app/frame/_components/PhotoEditor";
import Typography from "@/components/ui/typography";

interface Frame {
    id: string;
    url: string;
    name: string;
}


const App: React.FC = () => {

    return (
        <div className={'flex flex-col'}>
            <Typography>Upload Photo</Typography>
            <PhotoEditor />
        </div>
    );
};

export default App;