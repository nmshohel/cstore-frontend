
import { Button } from "antd";

import Head from "next/head";
import styles from "@/styles/Login.module.css";
import { signIn } from "next-auth/react";
import {
  GoogleOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useState } from "react";
const LoginPage = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setpassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    // //console.log(mobileNo, password)
    const result = await signIn("credentials", {
      mobileNo,
      password,
      callbackUrl: "http://localhost:3000",
    });
    if (result?.error) {
      console.error("Login error:", result.error);
    }
  };
  return (
    <div>
      <Head>
        <title>Users Login</title>
      </Head>
      <div className={styles.form}>

        <h3>LOGIN</h3>
        <div className={styles.social_icons}>

          <UserOutlined />
        </div>
        <hr />
        <form>
          <label htmlFor="">Your Phone</label>
          <input type="email" onChange={e => setMobileNo(e.target.value)} />
          <label htmlFor="">Your Password</label>
          <input type="password" onChange={e => setpassword(e.target.value)} />
          <Button onClick={handleLogin}>Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
