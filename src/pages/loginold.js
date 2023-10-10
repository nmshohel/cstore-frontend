import { Button } from "antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import Head from "next/head";
import styles from "@/styles/Login.module.css";
import { signIn } from "next-auth/react";

const LoginPage = () => {

  return (
    <div>
      <Head>
        <title>Users Login</title>
      </Head>
      <div className={styles.form}>

        <h3>LOGIN</h3>
        <div className={styles.social_icons}>
          <GoogleOutlined onClick={() => signIn("google", {
            callbackUrl: "https://pbsstore.vercel.app/"
          })} />
          {/* <GithubOutlined onClick={()=>signIn("github",{
            callbackUrl:"https://pbsstore.vercel.app/"
          })}/> */}
        </div>
        <hr />
        {/* <form>
          <label htmlFor="">Your Email</label>
          <input type="email" />
          <label htmlFor="">Your Password</label>
          <input type="password" />
          <Button>Login</Button>
        </form> */}
      </div>
    </div>
  );
};

export default LoginPage;
