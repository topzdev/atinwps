"use client";

import React, {useMemo, useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";

interface PhotoEditorProps {
    frame?: string;
    image?: File | null;
}

const ZOOM_LEVEL = 1;
const PhotoEditor: React.FC<PhotoEditorProps> = ({frame = 'atinwpsframe.png'}) => {
    const editor = useRef<any>(null);
    const fileInputRef = useRef<any>(null);
    const [image, setImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);
    const [rounded, setRounded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_LEVEL);

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

    const handleFileInputChange = (event) => {
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
    }

    const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (editor && editor.current) {
            const delta = event.deltaY;
            let newZoom = zoomLevel;

            if (delta > 0) {
                newZoom = Math.max(0.2, zoomLevel - 0.1);
            } else {
                newZoom = Math.min(2.0, zoomLevel + 0.1);
            }

            setZoomLevel(newZoom);
        }
    };

    return (
        <div className="flex flex-col w-full items-center mt-8">
            <div className={cn('flex relative sm:w-[400px] sm:h-[400px] lg:h-[500px] lg:w-[500px] !aspect-square border border-border bg-slate-100 mx-auto', rounded ? 'rounded-full overflow-hidden' : '')}
                 onClick={image ? null : handleInputClick}>
                <AvatarEditor
                    ref={editor}
                    image={image}
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
                        <Button className={'w-full'} size={'lg'} variant={'outlined'} onClick={() => setImage(null)}>Remove
                            Photo</Button>
                    </>}
            </div>

            <canvas ref={canvasRef}
                    className="mt-4 border border-gray-500 rounded-lg shadow-md h-[500px] w-[500px] hidden"/>
        </div>
    );
};

export default PhotoEditor;
