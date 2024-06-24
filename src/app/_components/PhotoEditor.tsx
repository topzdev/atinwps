"use client";

import React, {useMemo, useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";

interface PhotoEditorProps {
    frame?: string;
    image?: File | null;
}

const ZOOM_LEVEL = 1;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const PhotoEditor: React.FC<PhotoEditorProps> = ({frame = 'atinwpsframe.png'}) => {
    const { toast } = useToast();
    const editor = useRef<any>(null);
    const fileInputRef = useRef<any>(null);
    const [image, setImage] = useState<string | null>(null);
    const canvasRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [rounded, setRounded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_LEVEL);
    const lastTouchDistanceRef = useRef<number>(0);

    const handleDownload = async () => {
        setLoading(true);
        const img = editor.current?.getImageScaledToCanvas().toDataURL();

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx) {
            const mainPhotoUrl = img;
            const frameImageUrl = frame;

            canvas.width = 1000;
            canvas.height = 1000;

            const mainPhoto = new Image();
            mainPhoto.crossOrigin = 'anonymous';
            mainPhoto.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (rounded) {
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                }

                ctx.drawImage(mainPhoto, 0, 0, canvas.width, canvas.height);
                const frameImage = new Image();
                frameImage.crossOrigin = 'anonymous';
                frameImage.onload = () => {
                    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

                    const imageDataURL = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = imageDataURL;
                    a.download = 'atinwps-' + Date.now() + '.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setLoading(false);
                    toast({
                        title: 'Photo Downloaded',
                        description: 'Thank you for join to this cause! #AtinAngWestPhilippineSea'
                    })
                };
                frameImage.src = frameImageUrl;
            };
            mainPhoto.src = mainPhotoUrl;
        }
    }

    const handleInputClick = (event: React.MouseEvent<any, MouseEvent>) => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                resetChanges();
                setImage(reader.result as string);
                fileInputRef.current.value = null;  // Clear the file input
            };
            reader.readAsDataURL(file);
        }
    };

    const resetChanges = () => {
        setZoomLevel(ZOOM_LEVEL);
        setRounded(false);
    }

    const handleScroll = (event: React.WheelEvent<any>) => {
        event.preventDefault();
        event.stopPropagation();
        if (editor && editor.current) {
            const delta = event.deltaY;
            let newZoom = zoomLevel;

            if (delta > 0) {
                newZoom = Math.max(MIN_ZOOM, zoomLevel - 0.1);
            } else {
                newZoom = Math.min(MAX_ZOOM, zoomLevel + 0.1);
            }

            setZoomLevel(newZoom);
        }
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            lastTouchDistanceRef.current = distance;
        }
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const zoomChange = distance - lastTouchDistanceRef.current;

            if (Math.abs(zoomChange) > 10) { // Sensitivity threshold
                let newZoom = zoomLevel + (zoomChange / 200);
                newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
                setZoomLevel(newZoom);
                lastTouchDistanceRef.current = distance;
            }
        }
    };

    const handleRemove = () => {
        setImage(null)
        resetChanges();
    }

    return (
        <div className="flex flex-col w-full items-center mt-8">
            <div className={cn('flex relative sm:w-[400px] sm:h-[400px] lg:h-[500px] lg:w-[500px] !aspect-square border border-border bg-slate-100 mx-auto', rounded ? 'rounded-full overflow-hidden' : '')}
                 onClick={image ? () => {} : handleInputClick}
                 onWheel={handleScroll}
                 onTouchStart={handleTouchStart}
                 onTouchMove={handleTouchMove}
            >
                <AvatarEditor
                    ref={editor}
                    image={image as string}
                    color={[255, 255, 255, 0.6]}
                    rotate={0}
                    scale={zoomLevel}
                    height={500}
                    width={500}
                    border={0}
                    className="!h-full !w-full"

                />
                <img src={frame} alt="Selected Frame"
                     className="w-full h-full absolute top-0 left-0 pointer-events-none"/>
            </div>
            <input ref={fileInputRef} type={'file'}
                   style={{display: 'none'}}
                   accept="image/*"
                   onChange={handleFileInputChange}/>


            <div className='flex flex-col mt-2 gap-y-2 w-full mx-auto px-4'>


                {!image ? <>
                        <Button className={'w-full'} size={'lg'} onClick={handleInputClick}>Choose Photo</Button>
                    </> :
                    <>
                        <div className='text-start w-full'>
                            <label htmlFor="">Zoom</label>
                            <Slider disabled={!image} value={[zoomLevel]} onValueChange={(val) => setZoomLevel(val[0])}
                                    min={0.2} max={2} step={0.1}></Slider>
                        </div>
                        <div className='text-start flex items-center gap-x-2 w-full mb-4'>
                            <label htmlFor="">Rounded Frame?</label>
                            <Switch checked={rounded} onCheckedChange={setRounded}></Switch>
                        </div>

                        <Button disabled={loading} loading={loading} size={'lg'} className={'w-full'}
                                onClick={handleDownload}>Download Photo</Button>
                        <Button className={'w-full'} size={'lg'} variant={'outlined'} onClick={handleRemove}>Remove
                            Photo</Button>
                    </>}
            </div>

            <canvas ref={canvasRef}
                    className="mt-4 border border-gray-500 rounded-lg shadow-md h-[500px] w-[500px] hidden"/>
        </div>
    );
};

export default PhotoEditor;
