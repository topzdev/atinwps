"use client";

import React, {useMemo, useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {Button} from "@/components/ui/button";

interface PhotoEditorProps {
    frame?: string;
    image?: File | null;
}

const ZOOM_LEVEL = 1.0;
const PhotoEditor: React.FC<PhotoEditorProps> = ({frame = 'atinwpsframe.png'}) => {
    const editor = useRef(null);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    const handleDownload = async () => {
        const img = editor.current?.getImageScaledToCanvas().toDataURL();


        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx) {
            // Example main photo and frame image URLs (replace with actual images or use dynamically)
            const mainPhotoUrl = img; // Example main photo URL
            const frameImageUrl = frame; // Example frame image URL

            // Set canvas dimensions based on the main photo size
            canvas.width = 1000;
            canvas.height = 1000;

            // Load main photo
            const mainPhoto = new Image();
            mainPhoto.crossOrigin = 'anonymous'; // Enable CORS if loading from external URLs
            mainPhoto.onload = () => {
                ctx.drawImage(mainPhoto, 0, 0, canvas.width, canvas.height);

                // Load frame image and overlay on top of main photo
                const frameImage = new Image();
                frameImage.crossOrigin = 'anonymous'; // Enable CORS if loading from external URLs
                frameImage.onload = () => {
                    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

                    // Optionally, download the canvas content as an image
                    const imageDataURL = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = imageDataURL;
                    a.download = 'atinwps-'+ Date.now()+'.png'; // Default file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                frameImage.src = frameImageUrl;
            };
            mainPhoto.src = mainPhotoUrl;
        }
    }
    const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_LEVEL);

    const handleInputClick = (event:  React.MouseEvent<any, MouseEvent>) => {
        // Trigger the file input click event
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const resetChanges = () => {
        setZoomLevel(ZOOM_LEVEL);
    }

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        // Handle the selected file here, e.g., upload or process it
        console.log('Selected file:', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Use reader.result as the image preview URL
                resetChanges()
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (editor && editor.current) {
            const delta = event.deltaY;
            let newZoom = zoomLevel;

            if (delta > 0) {
                // Zoom out
                newZoom = Math.max(0.2, zoomLevel - 0.1);
            } else {
                // Zoom in
                newZoom = Math.min(2.0, zoomLevel + 0.1);
            }

            setZoomLevel(newZoom);
        }
    };

    return (
        <div className="flex flex-col w-[500px] mx-auto items-center mt-8">

            <div className={'flex relative h-[500px] w-[500px] border border-border bg-slate-100'}
                 onWheel={handleScroll} onClick={image ? null : handleInputClick}>
                <AvatarEditor
                    ref={editor}
                    image={image}
                    width={500}
                    height={500}
                    color={[255, 255, 255, 0.6]} // RGBA
                    rotate={0}
                    scale={zoomLevel}
                    border={0}
                    className="mb-4"
                />
                <img src={frame} alt="Selected Frame"
                     className="w-full h-full absolute top-0 left-0 pointer-events-none"/>
            </div>
            <input ref={fileInputRef} type={'file'}
                   style={{display: 'none'}}
                   accept="image/*"
                   onChange={handleFileInputChange}/>

            <div className='flex flex-col mt-2 gap-y-2 w-full'>
                {!image ? <>
                        <Button className={'w-full'} size={'lg'} onClick={handleInputClick}>Choose Photo</Button>
                    </> :
                    <>
                        <Button size={'lg'} className={'w-full'} onClick={handleDownload}>Download Photo</Button>
                    </>}
                <Button className={'w-full'} size={'lg'} variant={'outlined'} onClick={handleInputClick}>Change
                    Photo</Button>
            </div>

            <canvas ref={canvasRef} className="mt-4 border border-gray-500 rounded-lg shadow-md h-[500px] w-[500px] hidden"/>
        </div>
    );
};

export default PhotoEditor;