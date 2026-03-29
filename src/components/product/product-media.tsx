import { IProductMedia } from '@/interfaces/Product';
import UploadPhoto from '../common/upload-image';
import { Button, Flex, Image, message, Tag } from 'antd';
import { DeleteFilled, PlayCircleFilled, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/api/endpoints';
import api from '@/api';

interface IProps {
  productId: number;
  media?: IProductMedia[];
}

const MAX_PHOTOS = 4;
const MAX_VIDEOS = 1;

const ProductMedia = ({ productId, media }: IProps) => {
  const [mediaList, setMediaList] = useState<IProductMedia[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (media) setMediaList(media);
  }, [media]);

  const deleteImage = async (mediaId: number) => {
    try {
      setDeletingId(mediaId);
      await api.post(
        `${API_ENDPOINTS.PRODUCTS}/${productId}/delete-media`,
        { media_id: mediaId }
      );
      setMediaList(prev => prev.filter(item => item.id !== mediaId));
      message.success('Deleted successfully');
    } catch {
      message.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const photoCount  = mediaList.filter(m => m.type === 'photo').length;
  const videoCount  = mediaList.filter(m => m.type !== 'photo').length;
  const canAddPhoto = photoCount < MAX_PHOTOS;
  const canAddVideo = videoCount < MAX_VIDEOS;

  return (
    <div style={{ paddingTop: 16 }}>

      {/* ── What is this section ── */}
      <div style={{
        padding: "12px 14px", borderRadius: 10,
        background: "#f0f9ff", border: "1px solid #bae6fd",
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0369a1", marginBottom: 4 }}>
          📷 Gallery Media — Secondary Images & Video
        </div>
        <div style={{ fontSize: 11, color: "#0c4a6e", lineHeight: 1.6 }}>
          These photos and video appear in the product gallery page alongside the <b>cover image</b> above. They are <b>not</b> the cover — buyers see these when they open the full product view.
        </div>
      </div>

      {/* ── Limits bar ── */}
      <div style={{
        display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 8,
          background: photoCount >= MAX_PHOTOS ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${photoCount >= MAX_PHOTOS ? "#fecaca" : "#bbf7d0"}`,
          fontSize: 11, fontWeight: 600,
          color: photoCount >= MAX_PHOTOS ? "#dc2626" : "#15803d",
        }}>
          <PictureOutlined />
          {photoCount}/{MAX_PHOTOS} photos
          {photoCount >= MAX_PHOTOS && <span style={{ fontWeight: 400, color: "#dc2626" }}> — limit reached</span>}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 8,
          background: videoCount >= MAX_VIDEOS ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${videoCount >= MAX_VIDEOS ? "#fecaca" : "#bbf7d0"}`,
          fontSize: 11, fontWeight: 600,
          color: videoCount >= MAX_VIDEOS ? "#dc2626" : "#15803d",
        }}>
          <VideoCameraOutlined />
          {videoCount}/{MAX_VIDEOS} video
          {videoCount >= MAX_VIDEOS && <span style={{ fontWeight: 400, color: "#dc2626" }}> — limit reached</span>}
        </div>
      </div>

      {/* ── Media grid ── */}
      <Flex wrap="wrap" gap={10} style={{ marginBottom: 14 }}>
        {mediaList.map((m) => (
          <div
            key={m.id}
            style={{
              position: "relative",
              width: 100, height: 100,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {m.type === "photo" ? (
              <Image
                src={m.small}
                height={100}
                width={100}
                preview
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div style={{
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                background: "#1e293b",
                height: 100, width: 100,
                gap: 4,
              }}>
                <PlayCircleFilled style={{ fontSize: 28, color: "#fff" }} />
                <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>VIDEO</span>
              </div>
            )}

            {/* Type badge */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: m.type === "photo" ? "rgba(99,102,241,0.82)" : "rgba(30,41,59,0.82)",
              color: "#fff",
              fontSize: 9, fontWeight: 600,
              textAlign: "center",
              padding: "2px 0",
            }}>
              {m.type === "photo" ? "PHOTO" : "VIDEO"}
            </div>

            {/* Delete */}
            <Button
              size="small"
              danger
              shape="circle"
              icon={<DeleteFilled style={{ fontSize: 10 }} />}
              loading={deletingId === m.id}
              onClick={() => deleteImage(m.id)}
              style={{
                position: "absolute", top: 4, right: 4,
                background: "rgba(15,23,42,0.60)",
                border: "none", color: "#fff",
                width: 22, height: 22, minWidth: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            />
          </div>
        ))}

        {/* Upload — only show if under limits */}
        {(canAddPhoto || canAddVideo) && (
          <UploadPhoto
            setValue={() => {}}
            size="default"
            productId={productId}
            allowMultiple={true}
          />
        )}
      </Flex>

      {/* ── Tips ── */}
      <div style={{
        padding: "10px 12px", borderRadius: 8,
        background: "#fafafa", border: "1px solid #f1f5f9",
        fontSize: 11, color: "#64748b", lineHeight: 1.7,
      }}>
        <div>💡 <b>Cover image</b> is the main photo set above — not here</div>
        <div>🖼️ Add up to <b>4 gallery photos</b> showing different angles, colours, sizes</div>
        <div>🎥 Add up to <b>1 product video</b> (demo, unboxing, usage)</div>
        <div>✅ Recommended: 800×800px, JPG/PNG, under 2MB per image</div>
      </div>
    </div>
  );
};

export default ProductMedia;
