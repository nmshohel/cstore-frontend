import React, { useEffect, useState } from "react";
import { Layout, Menu, Switch, Button, Drawer, Row, Col } from "antd";
import {
  HomeOutlined,
  MenuOutlined,
  FileProtectOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
const { Header } = Layout;
import Image from 'next/image';
const ResponsiveNav = ({ children }) => {

  const { data: session } = useSession();

  // console.log(session);
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const [current, setCurrent] = useState('1');
  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const menu = <>
   <Menu.Item key="3" icon={<FileProtectOutlined />}>
      <Link style={{ textDecoration: 'none' }} href="/dashboard">
        My Products
      </Link>
    </Menu.Item>
    {
      session?.role?.role == 'admin' || session?.role?.role == 'incharge' ?
        <Menu.Item key="2" icon={<FileProtectOutlined />}>
          <Link style={{ textDecoration: 'none' }} href="/info">
            Product Entry
          </Link>
        </Menu.Item> : ""}
    {
      session?.role?.role == 'admin' ?
        <Menu.Item key="6" icon={<UsergroupAddOutlined />}>
          <Link style={{ textDecoration: 'none' }} href="/admin">
            Admin
          </Link>
        </Menu.Item> : ""}

  </>
  return (
    <Layout className="layout">
      <Header style={{ padding: 0 }}>
        <Row justify="space-between" align="right">
          <Col xs={20} sm={20} md={8}>
            <div
              className="logo"
              style={{ color: "white", paddingLeft: "50px" }}
            >
              PBS Common Store
            </div>
          </Col>
          <Col xs={0} sm={0} md={10}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>

              {menu}


            </Menu>
          </Col>
          <Col xs={25} sm={0} md={6}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>

              {
                !session?.session?.user ? <Menu.Item key="6">
                  <Button type="primary" >
                    <Link style={{ color: "black", textDecoration: 'none' }} href="/login">
                      Login
                    </Link>
                  </Button>
                </Menu.Item> : <>
                  <Menu.SubMenu 
                  // icon={<Image alt="User Name" src={session?.session?.user?.image} width={25} height={25} />}
                   title={session?.name?.name} key="7" style={{ color: "cyan", textDecoration: 'none' }}>
                    <Menu.Item key="7:1"><Link style={{ color: "green", textDecoration: 'none' }} href="/profile">
                      Profile
                    </Link></Menu.Item>

                    <Menu.Item key="7:2" onClick={() => signOut()}>Logout</Menu.Item>
                  </Menu.SubMenu></>
              }</Menu>
          </Col>

          <Col xs={2} sm={2} md={0}>
            <Button type="primary" onClick={showDrawer}>
              <MenuOutlined />
            </Button>
          </Col>
        </Row>
        <Drawer
          title="Menu"
          placement="left"
          onClick={onClose}
          onClose={onClose}
          open={visible}
        >
          <Menu mode="vertical" defaultSelectedKeys={["1"]} selectedKeys={[current]}>
            <Switch
              checked={theme === 'dark'}
              onChange={changeTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
            <br />
            <br />
            {menu}
            {
              !session?.user ? <Menu.Item key="6">
                <Button type="primary" >
                  <Link style={{ color: "green", textDecoration: 'none' }} href="/login">
                    Login
                  </Link>
                </Button>
              </Menu.Item> : <Menu.SubMenu icon={<Image alt="User Name" src={session?.user?.image} width={25} height={25} />} title={session?.user?.name} key="7" style={{ color: "cyan", textDecoration: 'none' }}>
                <Menu.Item key="7:1"><Link style={{ color: "green", textDecoration: 'none' }} href="/profile">
                  Profile
                </Link></Menu.Item>

                <Menu.Item key="7:2" style={{ color: "green", textDecoration: 'none' }} onClick={() => signOut()}>Logout</Menu.Item>
              </Menu.SubMenu>
            }
          </Menu>

        </Drawer>{children}
      </Header>

    </Layout>
  );
};

export default ResponsiveNav;