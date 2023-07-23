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


export default function ImageEditor(this: any) {
    // CONTEXT
    const {
        openImageUploader: open,
        setOpenImageUploader: setOpen,
        imageToUpload,
        setEditedImage,

        setImageUrl,

        setSnackbarMessage
    }: any = React.useContext(CollectionsContext)

    console.log("IMAGE TO UPLOAD", imageToUpload)


    const canvasRef: any = React.useRef(null)
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
        imgObj.select('16:9');
    }

    const [cf, setcf] = React.useState<any>()

    console.log("CFFFF", cf)

    const [loading, setLoading] = useState(false)

    async function dlgDoneButtonClick() {
        setSnackbarMessage({
            open: true,
            vertical: 'top',
            horizontal: 'center',
            message: "Uploading image...",
            icon: <Box color="white"><CircularProgress size={24} color="inherit" /></Box>
        })

        imgObj.crop();
        let croppedData = imgObj.getImageData();
        let canvas: any = document.querySelector('#img-canvas');
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
        const base64 = ctx.canvas.toDataURL("image/jpeg")
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

    async function save() {
        // imgObj.crop();
        // let croppedData = imgObj.getImageData()

        // // Obtain a blob: URL for the image data.
        // console.log("DATA", croppedData.data)
        // const arrayBufferView = new Uint8Array(croppedData);

        // const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        // // const urlCreator = window.URL || window.webkitURL;
        // const imageUrl = URL.createObjectURL(blob);
        // console.log("URL", imageUrl)
        // setcf(imageUrl)

        await dlgDoneButtonClick()
        // const img: any = document.querySelector("#photo");
        // img.src = imageUrl;

        // const croppedFile = new File([croppedData], "cropped.png", { type: "image/png" })

        // console.log(croppedFile)

        // setcf(URL.createObjectURL(croppedFile))

        // const base64 = uint8ArrayToBase64(croppedData)

        // console.log(base64)


        // const formData = new FormData()
        // formData.append("file", croppedFile)
        // formData.append("upload_preset", "social_pledge")

        // await fetch(
        //     "https://api.cloudinary.com/v1_1/dfmoqlbyl/image/upload",
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             // Authorization: `Bearer ${token}`,
        //         },
        //         body: formData,
        //     }
        // ).then((response) => {
        //     console.log(response)
        // })

    }

    // function handleImageLoaded() {
    //     if (imgSrc === '') {
    //       let canvas = document.querySelector('#img-canvas');
    //       let image = document.querySelector('#custom-img');
    //       let ctx = canvas.getContext('2d');
    //       canvas.width = image.width < image.height ? image.width : image.height;
    //       canvas.height = canvas.width;
    //       ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    //       document.querySelector('.e-profile').classList.remove('e-hide');
    //     }
    //   }



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
                                {/* <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> */}
                                {/* <img src={cf} style={{ width: "10rem" }} /> */}
                                <Box className="e-profile e-hide" display="none">
                                    <div className="e-custom-wrapper">
                                        <canvas id="img-canvas"></canvas>
                                        {/* <img
                                            alt="img"
                                            className="e-custom-img"
                                            id="custom-img"
                                            // onLoad={handleImageLoaded}
                                            src="https://ej2.syncfusion.com/react/demos/src/image-editor/images/profile.png"
                                        /> */}
                                        {/* <input
                                            type="file"
                                            id="img-upload"
                                            className="e-custom-file"
                                            onChange={fileChanged}
                                        />
                                        <span
                                            id="custom-edit"
                                            className="e-custom-edit"
                                            onClick={editClicked}
                                        >
                                            <span className="e-custom-icon sb-icons"></span>
                                        </span> */}
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