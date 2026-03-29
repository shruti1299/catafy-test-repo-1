"use client"
import OnboardingTour from "@/components/OnboardingTour";
import { useEffect, useState } from "react";
import { Badge, Layout, Menu } from "antd";
import useSWR from 'swr';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { MenuProps } from "antd/es/menu";
import Link from "next/link";
import { Logo } from "@/images/index";
import { LogoIcon } from "@/images/index";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { IStoreDetail } from "@/interfaces/Store";
import api from "@/api";
import Loader from "@/components/loader";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useUserContext } from "@/contexts/UserContext";
import dayjs from "dayjs";
import {
    AppstoreOutlined,
    BookOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    TeamOutlined,
    BarChartOutlined,
    TagsOutlined,
    FileOutlined,
    SettingOutlined,
    ShareAltOutlined,
    FileTextOutlined,
    WhatsAppOutlined,
    CrownFilled,
    RocketFilled,
    LineChartOutlined,
    BgColorsOutlined,
} from "@ant-design/icons";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import { DashboardIcon, CatalogIcon, ProductsIcon, OrdersIcon, CustomersIcon, AnalyticsIcon, SettingsIcon } from "@/svg/index";

type MenuItem = Required<MenuProps>['items'][number];

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [activeSidebar, setActiveSidebar] = useState(pathname);
    const [loading, setLoading] = useState(false);
    const { storeDetail, setStoreDetail } = useUserContext();
    const router = useRouter();

    // Pending orders badge — polls every 2 min
    const { data: pendingData } = useSWR(
      `${API_ENDPOINTS.ORDERS}?status=0&page_size=1`,
      (url: string) => api.get(url).then(r => r.data),
      { refreshInterval: 120000 }
    );
    const pendingCount = pendingData?.total ?? pendingData?.meta?.total ?? 0;

    const SIDEBAR_MENU: MenuItem[] = [
        // ── Core ───────────────────────────────────

        {
    icon: <DashboardIcon />,
    label: <span className="tour-dashboard"><Link href="/">Dashboard</Link></span>,
    key: '/'
  },
  {
    icon: <CatalogIcon />,
    label: <span className="tour-catalog"><Link href="/catalogs">Catalogs</Link></span>,
    key: '/catalogs'
  },
  {
    icon: <ProductsIcon />,
    label: <span className="tour-inventory"><Link href={"/inventory"}>Inventory</Link></span>,
    key: '/inventory'
  },
  {
    icon: <OrdersIcon />,
    label: <span className="tour-orders"><Link href={"/orders"}>Orders</Link></span>,
    key: '/orders'
  },
  {
    icon: <CustomersIcon />,
    label: <span className="tour-customers"><Link href={"/customers"}>Customers</Link></span>,
    key: '/customers'
  },
  {
    icon: <AnalyticsIcon />,
    label: <span className="tour-analytics"><Link href={"/analytics"}>Analytics</Link></span>,
    key: '/analytics'
  },
  {
    icon: <SettingsIcon />,
    label: <span className="tour-settings"><Link href={"/settings"}>Settings</Link></span>,
    key: '/settings'
  },
        {
            icon: <AppstoreOutlined />,
            label: <Link href="/">Dashboard</Link>,
            key: '/',
        },
        {
            icon: <BookOutlined />,
            label: <Link href="/catalogs">Catalogs</Link>,
            key: '/catalogs',
        },
        {
            icon: <ShoppingCartOutlined />,
            key: '/orders',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/orders">Orders</Link>
                    {pendingCount > 0 && (
                        <Badge count={pendingCount} size="small" style={{ fontSize: 10, backgroundColor: '#ef4444' }} />
                    )}
                </span>
            ),
        },
        {
            icon: <TeamOutlined />,
            label: <Link href="/customers">Customers</Link>,
            key: '/customers',
        },

        // ── Products submenu ────────────────────────
        {
            icon: <InboxOutlined />,
            label: 'Products',
            key: 'group-products',
            children: [
                { icon: <InboxOutlined />, label: <Link href="/inventory">Inventory</Link>, key: '/inventory' },
                { icon: <TagsOutlined />, label: <Link href="/categories">Categories</Link>, key: '/categories' },
            ],
        },

        {
            icon: <ShareAltOutlined />,
            label: <Link href="/shareable">Shareable Links</Link>,
            key: '/shareable',
        },
        {
            icon: <WhatsAppOutlined />,
            key: '/whatsapp',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/whatsapp">WhatsApp</Link>
                    <span style={{
                        fontSize: 9, fontWeight: 700, lineHeight: '14px',
                        padding: '0 5px', borderRadius: 4,
                        background: 'rgba(251,191,36,0.25)',
                        color: '#fbbf24', letterSpacing: '0.04em',
                    }}>BETA</span>
                </span>
            ),
        },

        // ── Insights submenu ────────────────────────
        {
            icon: <LineChartOutlined />,
            label: 'Insights',
            key: 'group-insights',
            children: [
                { icon: <BarChartOutlined />, label: <Link href="/analytics">Analytics</Link>, key: '/analytics' },
                { icon: <FileTextOutlined />, label: <Link href="/reports">Reports</Link>, key: '/reports' },
            ],
        },

        // ── Store Setup submenu ─────────────────────
        {
            icon: <SettingOutlined />,
            label: 'Store Setup',
            key: 'group-setup',
            children: [
                { icon: <FileOutlined />, label: <Link href="/pages">Store Pages</Link>, key: '/pages' },
                // { icon: <BgColorsOutlined />, label: <Link href="/branding">Branding</Link>, key: '/branding' },
                { icon: <SettingOutlined />, label: <Link href="/settings">Settings</Link>, key: '/settings' },
            ],
        },
    ];

    const onClickSidebarMenu: MenuProps['onClick'] = (e) => {
        setActiveSidebar(e.key);
    };

    const getUser = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<IStoreDetail>(API_ENDPOINTS.USER);
            setStoreDetail(data);
            const plan = data?.active_plan;
            if (!plan) {
                router.push("/pricing");
            } else {
                const isExpired = plan.end_at && dayjs(plan.end_at).isBefore(dayjs());
                if (plan.status !== "active" || isExpired) {
                    router.push("/pricing");
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const getSelectedKey = () => {
        if (pathname.startsWith("/categories")) return "/categories";
        if (pathname.startsWith("/orders"))     return "/orders";
        if (pathname.startsWith("/inventory"))  return "/inventory";
        if (pathname.startsWith("/whatsapp"))   return "/whatsapp";
        if (pathname.startsWith("/analytics"))  return "/analytics";
        if (pathname.startsWith("/reports"))    return "/reports";
        if (pathname.startsWith("/shareable"))  return "/shareable";
        if (pathname.startsWith("/pages"))      return "/pages";
        if (pathname.startsWith("/branding"))   return "/branding";
        if (pathname.startsWith("/settings"))   return "/settings";
        if (pathname.startsWith("/customers"))  return "/customers";
        if (pathname.startsWith("/catalogs"))   return "/catalogs";
        return pathname;
    };

    const getOpenKeys = () => {
        if (["/inventory", "/categories"].some(p => pathname.startsWith(p))) return ["group-products"];
if (["/analytics", "/reports"].some(p => pathname.startsWith(p)))    return ["group-insights"];
        if (["/pages", "/branding", "/settings"].some(p => pathname.startsWith(p))) return ["group-setup"];
        return [];
    };

    useEffect(() => {
        getUser();
    }, []);

    const planName = storeDetail?.active_plan?.plan_name ?? "Free";
    const isGrowth = planName?.toLowerCase().includes("growth");

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            {/* Full-width announcement bar — spans sidebar + content */}
            <AnnouncementBar />

            <Layout style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <OnboardingTour />
                <Sider
                    breakpoint="md"
                    className="kat-sidebar"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={() => setCollapsed(!collapsed)}
                    width={210}
                    onBreakpoint={(broken) => { if (broken) setCollapsed(true); }}
                    style={{ height: "100%", overflow: "hidden" }}
                >
                    {/* Logo */}
                    <div className={collapsed ? "kat-clogo" : "kat-logo"}>
                        <Image src={collapsed ? LogoIcon : Logo} alt="catafy-logo" />
                    </div>

                    {/* Nav Menu */}
                    <Menu
                        theme="dark"
                        selectedKeys={[getSelectedKey()]}
                        defaultOpenKeys={getOpenKeys()}
                        mode="inline"
                        inlineIndent={14}
                        className="kat-menu"
                        style={{ fontSize: 13, padding: "4px 8px", background: "transparent", border: "none" }}
                        items={SIDEBAR_MENU}
                        onClick={onClickSidebarMenu}
                    />

                    {/* Plan card at the bottom */}
                    {!collapsed && storeDetail && (
                        <div className="side-plan-detail">
                            <Link href="/billing">
                                <div className="plan-icon">
                                    {isGrowth ? <RocketFilled /> : <CrownFilled />}
                                </div>
                                <p className="plan-label">Your Plan</p>
                                <p className="plan-name">{planName}</p>
                                {!isGrowth && <p className="plan-upgrade">Upgrade ↗</p>}
                            </Link>
                        </div>
                    )}
                </Sider>

                <Layout style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
                    <Navbar />
                    <Content className="content-container">
                        {loading ? <Loader /> : <>{children}</>}
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}
