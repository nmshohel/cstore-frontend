import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const AdminSidebar = ({ children, setZonalCode, setformId }) => {
  const { props } = children;
  //console.log('Childer from Adminside', children);
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

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

    getItem('Sub Category', 'sub1', <UserOutlined />, [
      getItem('Add Sub Category', '1'),
      getItem('Manage Sub Category', '2'),
    ]),
    getItem('Category', 'sub2', <UserOutlined />, [
      getItem('Add Category', '3'),
      getItem('Manage Category', '4'),
    ]),

    getItem('Designation', 'sub3', <UserOutlined />, [
      getItem('Add Designation', '5'),
      getItem('Manage Designation', '6'),
    ]),
    getItem('Department', 'sub4', <TeamOutlined />, [
      getItem('Add Department', '7'),
      getItem('Manage Department', '8'),
    ]),
    getItem('User', 'sub5', <UserOutlined />, [
      getItem('Add User', '9'),
      getItem('Manage Users', '10'),
    ]),
    getItem('Office', 'sub6', <BuildOutlined />, [
      getItem('Add HQ/Zonal/SubZonal', '11'),
      getItem('Add CCS', '12'),
      getItem('HQ/Zonal/SubZonal', '13'),
      getItem('CCS', '14'),
    ]),
    // getItem('Team', 'sub5', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    // getItem('Files', '9', <FileOutlined />)
  ];
  const handleAdminSidebarClick = (label, key) => {
    // Here you can define the action you want to perform when a menu item is clicked.
    //console.log('Item with key', key, 'is clicked!');

    // Create a new breadcrumb item
    const newItem = {
      label,
      key,
    };
    setZonalCode(key);
    setformId(key);
    // Update breadcrumbItems state with the new item
    setBreadcrumbItems(prevBreadcrumb => [newItem]);
  };

  //  const handleAdminSidebarClick = (reportKey) => {
  //     // Here you can define the action you want to perform when a report item is clicked.
  //     //console.log('Report with key', reportKey, 'is clicked!');
  //   };
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
        {/* <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
        </Menu> */}
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {items.map((item) => {
            if (item.children) {
              return (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((childItem) => (
                    <Menu.Item key={childItem.key} onClick={() => handleAdminSidebarClick(childItem.label, childItem.key)}>
                      {childItem.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon} onClick={() => handleAdminSidebarClick(item.label, item.key)}>
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
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Reports</Breadcrumb.Item>
            {breadcrumbItems.map(item => (
              <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
            ))}

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
export default AdminSidebar;