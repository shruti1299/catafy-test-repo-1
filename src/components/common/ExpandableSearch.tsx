"use client";

import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

interface Props {
  placeholder?: string;
  width?: number;
  onSearch: (value: string) => void;
}

export default function ExpandableSearch({
  placeholder = "Search...",
  width = 200,
  onSearch,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<any>(null);

  const openSearch = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const closeSearch = () => {
    if (!value) setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {!open && (
        <Button
          type="text"
          icon={<SearchOutlined />}
          onClick={openSearch}
        />
      )}

      <div
        style={{
          width: open ? width : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "all .25s ease",
        }}
      >
        <Input.Search
          ref={inputRef}
          placeholder={placeholder}
          allowClear
          enterButton
          onBlur={closeSearch}
          onSearch={(val) => onSearch(val)}
        />
      </div>
    </div>
  );
}