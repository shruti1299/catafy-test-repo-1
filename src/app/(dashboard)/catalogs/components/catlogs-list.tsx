"use client";

import {
    Button,
    Card,
    Drawer,
    message,
    Pagination,
    Select,
    Segmented,
    Space,
    Skeleton,
} from "antd";
import { PlusOutlined, AppstoreOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";
import { memo, useEffect, useState } from "react";
import CreateCatalog from "@/components/catalog/create-catalog-form";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ICatalog, ICatalogList } from "@/interfaces/Catalog";
import EmptyState from "../global/emptyState";
import { CatalogEmpty } from "@/images/index";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "@/components/catalog/SortableItem";
import ShareLink from "@/components/common/share-link";
import { useUserContext } from "@/contexts/UserContext";
import { slugify } from "@/utils/helper";
import ExpandableSearch from "@/components/common/ExpandableSearch";
import SectionsCatalogTree from "@/components/catalog/SectionsCatalogTree";
import Link from "next/link";

interface IProps {
    setSelectedCatalog: any;
    selectedCatalog: ICatalog;
}

type ActiveTab = "catalogs" | "sections";

const CatalogsList = ({ setSelectedCatalog, selectedCatalog }: IProps) => {
    const { storeDetail } = useUserContext();
    const IsSection = storeDetail?.store?.is_section ? true : false || false;
    const [initLoading, setInitLoading] = useState(true);
    const [editingLoading, setEditingLoading] = useState(false);
    const [data, setData] = useState<ICatalogList>({} as ICatalogList);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [catalog, setCatalog] = useState({} as ICatalog);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSection, setSelectedSection] = useState<number | "none" | null>(null);
    const [sections, setSections] = useState<{ id: number; name: string }[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("catalogs");
    const catalogLink = `https://${storeDetail?.store?.username}.catafy.com/catalogs/${slugify(selectedCatalog.name)}-${selectedCatalog?.id}`;
    const [pageSize, setPageSize] = useState(10);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingLoading(false);
    };

    const fetchSections = async () => {
        if (!IsSection) return;
        const { data } = await api.get(API_ENDPOINTS.SECTIONS);
        setSections(data);
    };

    const getData = async () => {
        setInitLoading(true);
        const params = new URLSearchParams({
            page: String(currentPage),
            per_page: String(pageSize),
            search: search || "",
        });
        if (selectedSection === "none") {
            params.set("no_section", "1");
        } else if (selectedSection) {
            params.set("section_id", String(selectedSection));
        }
        const { data } = await api.get(`${API_ENDPOINTS.CATALOGS}?${params}`);
        onSelectCatalog(data?.data?.[0]);
        setData(data);
        setInitLoading(false);
    };

    const onSelectCatalog = (cat: ICatalog) => {
        if (!cat || cat.id === selectedCatalog.id) return;
        setSelectedCatalog(cat);
    };

    const onEditCatalog = (cat: ICatalog) => {
        setEditingLoading(true);
        setCatalog(cat);
        setFormType(2);
        setIsModalOpen(true);
        setTimeout(() => setEditingLoading(false), 300);
    };

    const handleAfterCreated = () => {
        getData();
        setIsModalOpen(false);
    };

    const createNewCatalog = () => {
        setCatalog({} as ICatalog);
        setFormType(1);
        setIsModalOpen(true);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = data.data.findIndex((i) => i.id === active.id);
            const newIndex = data.data.findIndex((i) => i.id === over.id);
            const newItems = arrayMove(data.data, oldIndex, newIndex);
            setData({ ...data, data: newItems });

            const orderPayload = newItems.map((item, index) => ({
                id: item.id,
                order: index + 1,
            }));

            try {
                await api.post(API_ENDPOINTS.UPDATE_CATALOG_ORDER, orderPayload);
            } catch {
                message.error("Failed to save catalog order");
            }
        }
    };

    useEffect(() => { fetchSections(); }, [IsSection]);

    useEffect(() => {
        const delay = setTimeout(() => {
            getData();
        }, 300);
        return () => clearTimeout(delay);
    }, [currentPage, pageSize, search, selectedSection]);

    return (
        <Card
            title={
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        🗂️ Catalogs
                </span>
                // IsSection ? (
                //     <Segmented
                //         size="small"
                //         value={activeTab}
                //         onChange={(v) => setActiveTab(v as ActiveTab)}
                //         options={[
                //             {
                //                 value: "catalogs",
                //                 label: (
                //                     <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600 }}>
                //                         <UnorderedListOutlined /> Catalogs {IsSection}
                //                     </span>
                //                 ),
                //             },
                //             {
                //                 value: "sections",
                //                 label: (
                //                     <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600 }}>
                //                         <AppstoreOutlined /> Sections
                //                     </span>
                //                 ),
                //             },
                //         ]}
                //     />
                // ) : (
                //     <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                //         🗂️ Catalogs
                //     </span>
                // )
            }
            extra={
                activeTab === "catalogs" ? (
                    <Space size={4}>
                        <ExpandableSearch
                            placeholder="Search catalog"
                            onSearch={(value) => { setSearch(value); setCurrentPage(1); }}
                        />
                        <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={createNewCatalog}
                            style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
                        />
                    </Space>
                ) : null
            }
            className="catlog-sidebar"
            styles={{ header: { padding: "10px 12px", minHeight: 44 }, body: { padding: 0 } }}
            style={{ overflow: "hidden", border: "none", borderRadius: 0 }}
        >
            {/* ── SECTIONS TAB ────────────────────────────── */}
            {activeTab === "sections" && IsSection && (
                <div style={{ overflowY: "auto", height: "calc(100vh - 68px)" }}>
                    <SectionsCatalogTree
                        selectedCatalog={selectedCatalog}
                        onSelectCatalog={(cat) => {
                            setSelectedCatalog(cat);
                        }}
                        onEditCatalog={onEditCatalog}
                    />
                </div>
            )}

            {/* ── CATALOGS TAB ────────────────────────────── */}
            {activeTab === "catalogs" && (
                <>
                    {IsSection && sections.length > 0  && (
                        <div style={{borderBottom: "1px solid #f1f5f9" }}>
                            <Select
                                allowClear
                                placeholder="Filter by section"
                                style={{ width: "100%", fontSize: 12 }}
                                value={selectedSection}
                                onChange={(val) => { setSelectedSection(val ?? null); setCurrentPage(1); }}
                                options={[
                                    { label: "📭 No Section", value: "none" },
                                    ...sections.map((s) => ({ label: s.name, value: s.id })),
                                ]}
                            />
                            <div style={{ paddingBottom: 10, display: "flex", justifyContent: "flex-end" }}>
                                <Link href={"/sections"} >
                                <Button
                                    size="small"
                                    type="text"
                                    icon={<SettingOutlined style={{ fontSize: 11 }} />}
                                    style={{ color: "#6366f1", fontSize: 11 }}
                                >
                                    Manage sections
                                </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {initLoading ? (
                        <div style={{ padding: 5 }}>
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </div>
                    ) : (
                        <div style={{
                            marginTop: IsSection ? 5 : 0,
                            overflowY: "auto",
                            height: IsSection && sections.length > 0 ? "calc(100vh - 150px)" : "calc(100vh - 115px)",
                        }}>
                            {data.data?.length ? (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={data.data.map((item) => item.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {data.data.map((item, index) => (
                                            <SortableItem
                                                key={item.id}
                                                item={item}
                                                index={index}
                                                onSelectCatalog={onSelectCatalog}
                                                selectedCatalog={selectedCatalog}
                                                onEditCatalog={onEditCatalog}
                                                setIsShareOpen={setIsShareOpen}
                                            />
                                        ))}
                                    </SortableContext>
                                    <Pagination
                                        current={currentPage}
                                        total={data?.total}
                                        pageSize={data?.per_page}
                                        onChange={(page) => setCurrentPage(page)}
                                        pageSizeOptions={["5", "10", "15", "20"]}
                                        onShowSizeChange={(current, size) => {
                                            setCurrentPage(1);
                                            setPageSize(size);
                                        }}
                                        size="small"
                                        style={{ marginTop: 16, textAlign: "center" }}
                                    />
                                </DndContext>
                            ) : (
                                <EmptyState
                                    message={"No Catalog Found!"}
                                    buttonText={"Create New Catalog"}
                                    onClick={() => setIsModalOpen(true)}
                                    image={CatalogEmpty}
                                />
                            )}
                        </div>
                    )}
                </>
            )}

            <ShareLink
                isOpen={isShareOpen}
                setIsModalOpen={setIsShareOpen}
                link={catalogLink}
            />

            <Drawer
                title={formType !== 1 ? "Update " + catalog?.name : "Create New Catalog"}
                placement="left"
                width={"50%"}
                onClose={handleCancel}
                open={isModalOpen}
            >
                {editingLoading ? (
                    <Skeleton active paragraph={{ rows: 8 }} style={{ padding: 16 }} />
                ) : (
                    <CreateCatalog afterSuccess={handleAfterCreated} catalog={catalog} />
                )}
            </Drawer>
        </Card>
    );
};

export default memo(CatalogsList);
