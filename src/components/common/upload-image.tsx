import API_BASE_URL from "@/api/api_base_url";
import { API_ENDPOINTS } from "@/api/endpoints";
import { message, Upload } from "antd";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getToken } from "@/utils/get-token";

interface IProps {
    value?: string;
    setValue: any;
    size?: "full" | "default";
    type?: "cover" | "logo" | "banner" | "product_main_image";
    productId?: number;
    cardSize?:"default" | "small"
    allowMultiple?:boolean;
}

export default function UploadPhoto({ value, setValue, size = "full", type = "cover", productId = 0, cardSize = "default", allowMultiple = false}: IProps) {
    const [isUploading, setIsUploading] = useState(false);
    const auth_token = getToken();

    const IPassportPhotoProps = {
        name: 'cover',
        action: `${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`,
        headers: {
            authorization: `Bearer ${auth_token}`
        },
        data: {
            type: type,
            product_id: productId
        },
        onChange(info: any) {
            setIsUploading(true);
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                const { response } = info?.file;
                const image = response;
                setIsUploading(false);
                setValue(image.url);
                message.success(`Image uploaded successfully`);
            } else if (info.file.status === 'error') {
                setIsUploading(false);
                const { errors } = info?.file?.response;
                if (errors) {
                    const { image } = errors;
                    if (image) message.warning(image?.[0]);
                }

                if (info?.file?.response?.message) message.warning(info?.file?.response?.message);
            }
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <div style={{ marginBottom: cardSize == "default" ? "20px" : "5px" }}>
            {!value && <Upload
                {...IPassportPhotoProps}
                multiple={allowMultiple}
                listType="picture-card"
                showUploadList={allowMultiple}
                className={size == "default" ? "ok" : "kdyz-upload"}
            >
                {uploadButton}
            </Upload>}

            {value && <img src={value} alt="avatar" style={{ width: '100%', maxHeight: "250px" }} />}

            {!value && cardSize == "default" && <p style={{ marginTop: 5, fontSize: "0.9em" }}>
                (jpg, png images only. Maximum size 2000 KB or 2MB)
            </p>}
        </div>
    )
}
