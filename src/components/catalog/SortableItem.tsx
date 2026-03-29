import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Button, Space, Tag, Tooltip } from "antd";
import { LockOutlined, EyeOutlined, EditOutlined, HolderOutlined, ShareAltOutlined } from "@ant-design/icons";
import React from "react";

const SortableItem = ({ item, onSelectCatalog, selectedCatalog, onEditCatalog, setIsShareOpen }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const isActive = item.id === selectedCatalog?.id;

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "pointer",
    borderRadius: 8,
    marginBottom: 6,
    border: isActive ? "1.5px solid #6366f1" : "1px solid #f1f5f9",
    background: isActive ? "#eef2ff" : "#fff",
    boxShadow: isDragging
      ? "0 8px 24px rgba(99,102,241,0.2)"
      : isActive
      ? "0 2px 8px rgba(99,102,241,0.1)"
      : "0 1px 2px rgba(0,0,0,0.04)",
    padding: "8px 10px",
    transition: "all 0.15s ease",
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelectCatalog(item)}>

      {/* Row 1: drag handle + name + count */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          style={{ color: "#cbd5e1", fontSize: 13, cursor: "grab", flexShrink: 0 }}
        >
          <HolderOutlined />
        </span>

        <span style={{
          flex: 1,
          fontWeight: isActive ? 700 : 500,
          fontSize: 13,
          color: isActive ? "#4338ca" : "#1e293b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {item.name}
        </span>

        <span style={{
          fontSize: 11,
          color: isActive ? "#6366f1" : "#94a3b8",
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {item.products_count}
        </span>
      </div>

      {/* Row 2: status + visibility + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>
        <Space size={4}>
          <Tag
            color={item.status ? "blue" : "default"}
            style={{ fontSize: 10, margin: 0, padding: "0 5px", lineHeight: "18px", borderRadius: 4 }}
          >
            {item.status ? "Active" : "Off"}
          </Tag>
          <Tooltip title={item.visibilty === 2 ? "Locked" : "Public"}>
            {item.visibilty === 2
              ? <LockOutlined style={{ fontSize: 11, color: "#94a3b8" }} />
              : <EyeOutlined  style={{ fontSize: 11, color: "#94a3b8" }} />}
          </Tooltip>
        </Space>

        <Space size={0}>
          <Button
            type="text"
            size="small"
            icon={<ShareAltOutlined style={{ fontSize: 12 }} />}
            style={{ color: "#94a3b8", padding: "0 4px" }}
            onClick={e => { e.stopPropagation(); setIsShareOpen(true); }}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ fontSize: 12 }} />}
            style={{ color: isActive ? "#6366f1" : "#94a3b8", padding: "0 4px" }}
            onClick={e => { e.stopPropagation(); onEditCatalog(item); }}
          />
        </Space>
      </div>
    </div>
  );
};

export default SortableItem;
