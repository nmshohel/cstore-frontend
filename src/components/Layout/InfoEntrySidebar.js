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
  const items = [

    getItem('Revinue Item', 'sub1', <UserOutlined />, [
      getItem('Add', '1'),
      getItem('Manage', '2'),
    ]),
    getItem('Capital Item', 'sub2', <UserOutlined />, [
      getItem('Add', '3'),
      getItem('Manage', '4'),
    ]),
    getItem('Product Issue', 'sub3', <UserOutlined />, [
      getItem('Capital Item', '5'),
      getItem('Revinue Item', '6'),
    ]),
    getItem('Brand', 'sub4', <UserOutlined />, [
      getItem('Add Brand', '7'),
      getItem('Manage Brand', '8'),
    ]),
    getItem('Model', 'sub5', <UserOutlined />, [
      getItem('Add Model', '9'),
      getItem('Manage Model', '10'),
    ]),
    getItem('Supplier', 'sub6', <UserOutlined />, [
      getItem('Add Supplier', '11'),
      getItem('Manage Supplier', '12'),
    ]),
    // getItem('Files', '9', <FileOutlined />)
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  ];

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
          Developed By: Md. Daduggaman Sumon, JE(IT) & N M Shohel, JE(IT)
          Copyright Reserved ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};
export default InfoEntrySidebar;