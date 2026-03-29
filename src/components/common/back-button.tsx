"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import { DoubleLeftOutlined } from '@ant-design/icons';

interface IProps {
    backTo?: string;
}

const BackButton = ({ backTo }: IProps) => {
    const router = useRouter();

    const onBackClick = () => {
        if (backTo) router.replace(backTo);
        else router.back();
    }

    return (
        <div>
            <Button type="link" icon={<DoubleLeftOutlined />} onClick={onBackClick}>{" "}Go To Back</Button>
        </div>
    );
};

export default BackButton;