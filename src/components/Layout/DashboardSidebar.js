import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    DeleteRowOutlined,
    TransactionOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useSession } from 'next-auth/react';
const { Header, Content, Footer, Sider } = Layout;

const DashboardSidebar = ({ children, category, setFormId }) => {
    const { props } = children;
    const { data: session } = useSession();
    // //console.log('Category from Adminside', category);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    let items = "";
    if (session?.role?.role == 'storeHead') {
        items = [
            getItem('Certify', 'sub1', <UserOutlined />, [
                getItem('Capital Item', '1'),
            ]),
            getItem('Transection', 'sub3', <TransactionOutlined />, [
                getItem('Demand Capital Item', '3'),
                getItem('Demand Revinue Item', '4'),
                getItem('Issue To Me Capital Item', '5'),
                getItem('Issue To Me Revenue Item', '6'),
            ]),
            getItem('My Products', 'sub4', <ContainerOutlined />, [
                getItem('Capital Item', '7'),
                getItem('Revinue Item', '8'),
            ]),
            getItem('Used Item', 'sub5', <DeleteRowOutlined />, [
                getItem('Capital Item', '9'),
                getItem('Revinue Item', '10'),
            ]),
        ];
    }
    if (session?.role?.role == 'officeHead') {
        items = [
            getItem('Approve', 'sub2', <UserOutlined />, [
                getItem('Capital Item', '2'),
            ]),
            getItem('Transection', 'sub3', <TransactionOutlined />, [
                getItem('Demand Capital Item', '3'),
                getItem('Demand Revinue Item', '4'),
                getItem('Issue To Me Capital Item', '5'),
                getItem('Issue To Me Revenue Item', '6'),
            ]),
            getItem('My Products', 'sub4', <ContainerOutlined />, [
                getItem('Capital Item', '7'),
                getItem('Revinue Item', '8'),
            ]),
            getItem('Used Item', 'sub5', <DeleteRowOutlined />, [
                getItem('Capital Item', '9'),
                getItem('Revinue Item', '10'),
            ]),
        ];
    }
    else {
        items = [
            getItem('Transection', 'sub3', <TransactionOutlined />, [
                getItem('Demand Capital Item', '3'),
                getItem('Demand Revinue Item', '4'),
                getItem('Issue To Me Capital Item', '5'),
                getItem('Issue To Me Revenue Item', '6'),
            ]),
            getItem('My Products', 'sub4', <ContainerOutlined />, [
                getItem('Capital Item', '7'),
                getItem('Revinue Item', '8'),
            ]),
            getItem('Used Item', 'sub5', <DeleteRowOutlined />, [
                getItem('Capital Item', '9'),
                getItem('Revinue Item', '10'),
            ]),
        ];
    }


    const handleAdminSidebarClick = (reportKey) => {
        // Here you can define the action you want to perform when a report item is clicked.
        //console.log('Report with key', reportKey, 'is clicked!');
        setFormId(reportKey)
    };
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider> */}
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    {items.map((item) => {
                        if (item.children) {
                            return (
                                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                                    {item.children.map((childItem) => (
                                        <Menu.Item key={childItem.key} onClick={() => handleAdminSidebarClick(childItem.key)}>
                                            {childItem.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.key} icon={item.icon} onClick={() => handleAdminSidebarClick(item.key)}>
                                    {item.label}
                                </Menu.Item>
                            );
                        }
                    })}
                </Menu>
            </Sider>
            <Layout>
                {/* <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                /> */}
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Developed By: Md. Daduggaman Sumon, JE(IT) & N M Shohel, JE(IT)
                    Copyright Reserved ©2023
                </Footer>
            </Layout>
        </Layout>
    );
};
export default DashboardSidebar;