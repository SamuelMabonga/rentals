import { Box } from '@mui/material';
import { HtmlEditor, Link, Image, Inject, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import * as React from 'react';

class RichTextEditor extends React.Component<{}, {}> {
    public render() {
        return (
            <Box border="1px solid" borderColor={"lightgray"}>
            <RichTextEditorComponent >
                <p>The Rich Text Editor component is a WYSIWYG ("what you see is what you get") editor that provides the best user experience to create and update the content.
                    Users can format their content using standard toolbar commands.</p>
                <p><b>Key features:</b></p>
                <ul>
                    <li>
                        <p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p>
                    </li>
                    <li>
                        <p>Capable of handling Markdown editing.</p>
                    </li>
                </ul>
                <Inject services={[Toolbar, HtmlEditor, Link, Image]} />
            </RichTextEditorComponent>
            </Box>
        );
    }
}
export default RichTextEditor;