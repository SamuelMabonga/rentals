import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CollectionsContext } from 'context/context';
import dynamic from 'next/dynamic';
import React, { useContext, useState } from 'react';
// import FilerobotImageEditor, {
//     TABS,
//     TOOLS,
// } from 'react-filerobot-image-editor';

// const {
//     TABS,
//     TOOLS,
// }: any = dynamic(() => import('react-filerobot-image-editor'), {ssr: false});
const FilerobotImageEditor = dynamic(() => import('react-filerobot-image-editor'), { ssr: false });
const {
    TABS,
    TOOLS,
}: any = FilerobotImageEditor

export default function ImageUploader() {
    // CONTEXT
    const {
        openImageUploader: open,
        imageToUpload,
        setEditedImage
    }: any = useContext(CollectionsContext)

    const [isImgEditorShown, setIsImgEditorShown] = useState(true);

    const openImgEditor = () => {
        setIsImgEditorShown(true);
    };

    const closeImgEditor = () => {
        setIsImgEditorShown(false);
    };

    const tools = [
        { name: 'adjust', title: 'Adjust' },
      ]

    return (
        <Dialog open={open} fullScreen maxWidth="lg">
            <DialogTitle sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Typography>Edit and upload your image</Typography>
                <IconButton sx={{ ml: "auto" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <button onClick={openImgEditor}>Open Filerobot image editor</button>
                {isImgEditorShown && (
                    <FilerobotImageEditor
                        // source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
                        source={imageToUpload}
                        onSave={(editedImageObject, designState) => {
                            console.log('saved', editedImageObject, designState)

                            setEditedImage(editedImageObject)
                        }}
                        onClose={closeImgEditor}
                        annotationsCommon={{
                            fill: '#ff0000',
                        }}
                        Text={{ text: 'Filerobot...' }}
                        Rotate={{ angle: 90, componentType: 'slider' }}
                        Crop={{
                            presetsItems: [
                                {
                                    titleKey: 'classicTv',
                                    descriptionKey: '4:3',
                                    ratio: 4 / 3,
                                    // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
                                },
                                {
                                    titleKey: 'cinemascope',
                                    descriptionKey: '21:9',
                                    ratio: 21 / 9,
                                    // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                                },
                            ],
                            presetsFolders: [
                                {
                                    titleKey: 'socialMedia',

                                    // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
                                    groups: [
                                        {
                                            titleKey: 'facebook',
                                            items: [
                                                {
                                                    titleKey: 'profile',
                                                    width: 180,
                                                    height: 180,
                                                    descriptionKey: 'fbProfileSize',
                                                },
                                                {
                                                    titleKey: 'coverPhoto',
                                                    width: 820,
                                                    height: 312,
                                                    descriptionKey: 'fbCoverPhotoSize',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        }}
                        tabsIds={[
                            TABS?.ADJUST,
                            // TABS?.ANNOTATE,
                            // TABS?.WATERMARK
                        ]} // or {['Adjust', 'Annotate', 'Watermark']}
                        defaultTabId={TABS?.ADJUST} // or 'Annotate'
                        // defaultToolId={TOOLS?.TEXT} // or 'Text'
                        savingPixelRatio={0}
                        previewPixelRatio={0}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}