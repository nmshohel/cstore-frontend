import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const InfoEntrySidebar = ({ children, category, setFormId }) => {
  const { props } = children;
  // console.log('Category from Adminside', category);
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
  const items = [
    
    getItem('Electricity', 'sub1', <UserOutlined />, [
      getItem('Add', '1'),
      getItem('Current Month', '2'),
       getItem('All', '3'),
    ]),
    getItem('Complain', 'sub2', <UserOutlined />, [
      getItem('Add', '4'),
      getItem('Current Month', '5'),
      getItem('All', '6'),
    ]),
    getItem('Transformer', 'sub3', <UserOutlined />, [
      getItem('Add', '7'),
      getItem('Current Month', '8'),
      getItem('All', '9'),
    ]),
    getItem('SAIDI & SAIFI', 'sub4', <UserOutlined />, [
      getItem('Add', '10'),
      getItem('Current Month', '11'),
      getItem('All', '12'),
    ]),
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Logout', '13', <FileOutlined />)
  ];

  const handleAdminSidebarClick = (reportKey) => {
    // Here you can define the action you want to perform when a report item is clicked.
    console.log('Report with key', reportKey, 'is clicked!');
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
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
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
          Developed By: Md. Daduggaman Sumon, JE(IT), Chittagong PBS-2.
          Copyright Reserved ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};
export default InfoEntrySidebar;