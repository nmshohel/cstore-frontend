
import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TimePicker,
    TreeSelect,
} from 'antd';
import { notification } from "antd";
import { useSession } from 'next-auth/react';
const { Option } = Select;
import { Typography } from 'antd';
const { Title } = Typography;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const AddUser = ({zonal}) => {
    console.log(zonal)
    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const onFinish = (values) => {
        //console.log('Received values:', values);
        const pbs_code = session?.pbs_code?.pbs_code;
        // const accessToken = session?.accessToken?.accessToken;
        const withvalues = { ...values, pbs_code };
        //console.log(withvalues);
        fetch(`http://localhost:5000/user/create-user`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                // Authorization: accessToken,
            },
            body: JSON.stringify(withvalues),
        })
            .then((res) => res.json())
            .then((data) => {

                const openNotificationWithIcon = (type) => {
                    api[type]({
                        message: data?.message,

                    });
                };
                openNotificationWithIcon('success')

            });
    };
    const roles = [
        { id: 4, role: 'employee', value: 'user' },
        // { id: 4, role: 'employee', value: 'employee' },
        { id: 2, role: 'Admin', value: 'admin' },
        { id: 3, role: 'Zonal Admin', value: 'zonaladmin' },
        { id: 1, role: 'Super Admin', value: 'superadmin' },
    ]
    return (
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish}>
            {contextHolder}
            <Title level={2}>Add User</Title>
            <Form.Item label="Zonal" name="zonal_code" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Zonal',
                },
            ]}>
                <Select placeholder="Select a Zonal" allowClear>
                    {zonal.map((brand) => (
                        <Option value={brand.zonal_code} key={brand.zonal_code}>
                            {brand.zonal_name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Name"
                name="displayName"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Name',
                    },
                ]}
            >
                <Input placeholder="User Full Name" />
            </Form.Item>
            <Form.Item label="Role" name="role" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Role',
                },
            ]}>
                <Select placeholder="Select a Role" allowClear>
                    {roles.map((brand) => (
                        <Option value={brand.value} key={brand.id}>
                            {brand.role}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Email',
                    },
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Password" name="password" hasFeedback >
                <Input.Password placeholder="with input password" />
            </Form.Item>
            <Form.Item
                label="Image URL"
                name="image"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Image',
                    },
                ]}
            >
                <Input placeholder="User Image" />
            </Form.Item>
            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                <Button type="primary" htmlType="submit" block>
                    Submit
                </Button>
            </Form.Item>

        </Form>
    );
};

export default AddUser;
