import * as React from 'react';
import { ImageEditorComponent } from '@syncfusion/ej2-react-image-editor';
import { Browser, isNullOrUndefined, getComponent } from '@syncfusion/ej2-base';
import { Box, Button, CircularProgress, Dialog, IconButton } from '@mui/material';
import { CollectionsContext } from 'context/context';
import { Close } from '@mui/icons-material';
import { fromByteArray } from 'base64-js';
import { createElement } from '@syncfusion/ej2-base';
import { useState } from 'react';
// import { v2 as cloudinary } from "cloudinary"
// import streamifier from "streamifier"
// import { encode } from 'base64-js';
// import './default.css';

function uint8ArrayToBase64(uint8Array: any) {
    const base64String = fromByteArray(uint8Array);
    return base64String;
}

const sizes: any = {
    cover: {
        width: 1200,
        height: 675,
        aspectRatio: "16:9"
    },
    profile: {
        width: 400,
        height: 400,
        aspectRatio: "square"
    },
    avatar: {
        width: 200,
        height: 200,
        aspectRatio: "square"
    },
    post: {
        width: 600,
        height: 600,
        aspectRatio: "square"
    }
}


export default function ImageEditor(this: any) {
    // CONTEXT
    const {
        openImageUploader: open,
        setOpenImageUploader: setOpen,
        imageToUpload,
        setEditedImage,

        setImageUrl,

        setSnackbarMessage,
        imageType,
        setImageType
    }: any = React.useContext(CollectionsContext)

    let imgObj: any;
    function imageEditorCreated(): void {
        imgObj.select("Square");
        if (Browser.isDevice) {
            imgObj.open(imageToUpload);
        } else {
            imgObj.open(imageToUpload);
        }
        if (imgObj.theme && window.location.href.split('#')[1]) {
            imgObj.theme = window.location.href.split('#')[1].split('/')[1];
        }
    }
    const rightPane: any = document.getElementById('right-pane')
    if (!isNullOrUndefined(rightPane)) {
        rightPane.addEventListener('scroll', onScroll.bind(this));
    }

    const sliderWrapper: any = document.getElementById('image-editor_sliderWrapper')
    // Handler used to reposition the tooltip on page scroll
    function onScroll(): void {
        if (document.getElementById('image-editor_sliderWrapper')) {
            let slider: any = getComponent(sliderWrapper, 'slider');
            slider.refreshTooltip(slider.tooltipTarget);
        }
    }

    // FUNCTIONS
    function fileOpened() {
        console.log("FILE OPENED", imageType)
        imgObj.select(sizes[imageType].aspectRatio);
    }

    async function save() {
        setSnackbarMessage({
            open: true,
            vertical: 'top',
            horizontal: 'center',
            message: "Uploading image...",
            icon: <Box color="white"><CircularProgress size={24} color="inherit" /></Box>
        })

        imgObj.crop();
        let croppedData = imgObj.getImageData();
        console.log("CROPPED DATA", croppedData)
        let canvas: any = document.querySelector('#img-canvas');
        canvas.width = sizes[imageType].width;
        canvas.height = sizes[imageType].height;
        let ctx = canvas.getContext('2d');
        let parentDiv: any = document.querySelector('.e-profile');
        let tempCanvas = parentDiv.appendChild(createElement('canvas'));
        let tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = croppedData.width;
        tempCanvas.height = croppedData.height;
        tempContext.putImageData(croppedData, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        tempCanvas.remove();
        parentDiv.style.borderRadius = '100%';
        canvas.style.backgroundColor = '#fff';

        // console.log("CTX", ctx)
        const base64 = ctx.canvas.toDataURL("image/png")
        console.log("BASE64", base64)

        const formData = new FormData()
        formData.append("file", base64)
        formData.append("upload_preset", "social_pledge")


        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dfmoqlbyl/image/upload",
                {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    //     // Authorization: `Bearer ${token}`,
                    // },
                    body: formData,
                }
            )

            const data = await res.json()

            setImageUrl(data.url)
            setSnackbarMessage({
                open: false,
                vertical: 'top',
                horizontal: 'center',
                message: "Uploading image...",
                icon: <Box color="white"><CircularProgress size={24} color="inherit" /></Box>
            })
            setOpen(false)
        } catch (error) {
            console.log(error)
            // setLoading(false)
            setSnackbarMessage({
                open: false,
                vertical: 'top',
                horizontal: 'center',
                message: "Uploading image...",
                icon: <Box color="white"><CircularProgress size={24} color="inherit" /></Box>
            })
        }

    }


    return (
        <Dialog open={open} fullScreen>
            <div className='control-pane'>
                <div className='control-section'>
                    <div className='row'>
                        <div className='col-lg-12 control-section'>
                            <div className='e-img-editor-sample'>
                                <Box padding="1rem" display="flex">
                                    <IconButton onClick={() => setOpen(false)}>
                                        <Close />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        sx={{ ml: "auto" }}
                                        onClick={() => save()}
                                    >
                                        Save
                                    </Button>
                                </Box>
                                <ImageEditorComponent
                                    id='image-editor'
                                    toolbar={[]}
                                    ref={(img) => { imgObj = img }}
                                    created={imageEditorCreated}
                                    fileOpened={fileOpened}
                                    saved={(event, data) => console.log("SAVE EVENT", data)}
                                >
                                </ImageEditorComponent>
                                <Box className="e-profile e-hide" display="none">
                                    <div className="e-custom-wrapper">
                                        <canvas id="img-canvas"></canvas>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}