"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import api from "@/api";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
});

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
    const quillRef = useRef<any>(null);
    const QuillRef = useRef<any>(null);
    const [ready, setReady] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Load Quill + Modules
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadModules = async () => {
            const { Quill } = await import("react-quill-new");
            // @ts-ignore
            const ImageResize = (await import("quill-image-resize-module-react")).default;

            Quill.register("modules/imageResize", ImageResize);

            QuillRef.current = Quill;
            setReady(true);
        };

        loadModules();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Image Upload
    |--------------------------------------------------------------------------
    */

    const imageHandler = () => {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];

            if (!file) return;

            const formData = new FormData();
            formData.append("cover", file);

            try {
                const { data } = await api.post("/upload", formData);

                const editor = quillRef.current.getEditor();
                const range = editor.getSelection(true);

                editor.insertEmbed(range.index, "image", data.url);
            } catch {
                message.error("Image upload failed");
            }
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Toolbar
    |--------------------------------------------------------------------------
    */

    const modules =
        ready && {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    [{ font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["blockquote", "code-block"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },

            imageResize: {
                parchment: QuillRef.current?.import("parchment"),
            },
        };

    if (!ready) return null;

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            // @ts-ignore
            modules={modules}
        />
    );
}