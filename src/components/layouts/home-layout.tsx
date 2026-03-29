import React, { useEffect, useState } from "react";
import UploadPhoto from "../common/upload-image";
import { Button, Card, Image, Popconfirm, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

export default function HomeLayout() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(API_ENDPOINTS.BANNERS);
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    try {
      await api.delete(`${API_ENDPOINTS.BANNERS}/${id}`);
      message.success("Banner deleted");
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting banner:", error);
      message.error("Delete failed");
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <Card title="Home Page Banner">
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {banners?.map((banner: any) => (
          <div
            key={banner.id}
            style={{
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          >
            <Image
              src={banner.banner_url}
              preview
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
              }}
            />

            <Popconfirm
              title="Delete banner?"
              description="Are you sure you want to delete this banner?"
              onConfirm={() => handleDeleteBanner(banner.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              />
            </Popconfirm>
          </div>
        ))}
      </Space>

      <div style={{ marginTop: 20 }}>
        <UploadPhoto setValue={() => getBanners()} value={""} type="banner" />

        <p style={{ color: "#888", fontSize: 12, marginTop: 8 }}>
          Recommended Banner Size: <b>1400px × 380px</b>
        </p>
      </div>
    </Card>
  );
}