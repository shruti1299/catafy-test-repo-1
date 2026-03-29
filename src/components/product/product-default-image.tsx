import { Button, Image, message } from 'antd'
import React, { useState } from 'react'
import UploadPhoto from '../common/upload-image'
import { DeleteFilled } from "@ant-design/icons";
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';

interface IProps {
    image?: string;
    productId: number;
    onReload: any;
}

export default function ProductDeafultImage({ image, productId, onReload }: IProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteDefaultImage = async () => {
        try {
            setIsDeleting(true);
            await api.post(`${API_ENDPOINTS.PRODUCTS}/${productId}/delete-image`);
            setIsDeleting(false);
            onReload();
            message.success("Deleted Successfully");
        } catch (error) {
            setIsDeleting(false);
        }
    };

    const UpdateDefaultImage = async (newImage: string) => {
        try {
            await api.put(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
                image: newImage,
            });
            onReload();
            message.success("Image Updated Successfully Successfully");
        } catch (error) {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
            {image ? (
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                    <Image
                        src={image}
                        height={330}
                        width={"100%"}
                        alt="pi"
                        loading={"lazy"}
                        style={{ borderRadius: 10, objectFit: "cover", display: "block" }}
                    />
                    {/* Delete overlay button */}
                    <div
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                        }}
                    >
                        <Button
                            loading={isDeleting}
                            onClick={deleteDefaultImage}
                            size="middle"
                            icon={<DeleteFilled />}
                            danger
                            style={{
                                background: "rgba(15,23,42,0.6)",
                                border: "none",
                                color: "#fff",
                                borderRadius: 8,
                            }}
                        />
                    </div>
                    {/* Recommended size note */}
                    <div
                        style={{
                            marginTop: 6,
                            fontSize: 11,
                            color: "#94a3b8",
                            textAlign: "center",
                        }}
                    >
                        💡 Recommended: 800×800px, JPG or PNG, under 2MB
                    </div>
                </div>
            ) : (
                <div>
                    {/* Upload area hint */}
                    <div
                        style={{
                            padding: "10px 14px",
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            borderRadius: 8,
                            marginBottom: 12,
                            fontSize: 12,
                            color: "#92400e",
                            textAlign: "left",
                        }}
                    >
                        📸 Upload Cover Image — This is the main image buyers see first in your catalog. Use a clear, well-lit photo on a clean background.
                    </div>
                    <UploadPhoto
                        value={""}
                        setValue={UpdateDefaultImage}
                        type="product_main_image"
                        productId={productId}
                    />
                    <div
                        style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: "#94a3b8",
                        }}
                    >
                        💡 Recommended: 800×800px, JPG or PNG, under 2MB
                    </div>
                </div>
            )}
        </div>
    );
}
