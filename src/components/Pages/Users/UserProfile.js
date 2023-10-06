
import React, { useEffect } from 'react';
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

const UserProfile = ({ employee }) => {
    console.log(employee)
    const [api, contextHolder] = notification.useNotification();
    // const [dataSource, setDataSource] = useState(employee);
    const { data: session } = useSession();
    const [form] = Form.useForm();
    useEffect(() => {
        if (employee) {
            // const specificDate = moment(selectedCapitalItem.purchasedate, 'YYYY-MM-DD');
            form.setFieldsValue({
                mobileNo: employee.mobileNo,
                name: employee.name,
                designation: employee.designation,
                trgId: employee.trgId,
                phone: employee.phone,
                address: employee.address,
                photoUrl: employee.photoUrl,
                signUrl: employee.signUrl,
            });
        }
    }, [employee, form]);
    const onFinish = (values) => {
        console.log('Received values:', values);
        const accessToken = session?.accessToken?.accessToken;
        //console.log(withvalues);
        fetch(`http://localhost:5000/api/v1/employee/${values.mobileNo}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                Authorization: accessToken,
            },
            body: JSON.stringify(values),
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

    return (
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish} form={form}>
            {contextHolder}
            <Title level={2}>Update Profile</Title>
            <Form.Item
                label="User ID"
                name="mobileNo"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a User ID',
                    },
                ]}
            >
                <Input placeholder="User ID" disabled />
            </Form.Item>
            <Form.Item
                label="Name"
                name="name"
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
            <Form.Item
                label="Designation"
                name="designation"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Designation',
                    },
                ]}
            >
                <Input placeholder="Designation" disabled />
            </Form.Item>
            <Form.Item
                label="Training ID"
                name="trgId"
                hasFeedback
            // rules={[
            //     {
            //         required: true,
            //         message: 'Please provide a Training ID',
            //     },
            // ]}
            >
                <Input placeholder="Training ID" />
            </Form.Item>
            <Form.Item
                label="Phone"
                name="phone"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a phone number',
                    },
                ]}
            >
                <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide Address',
                    },
                ]}
            >
                <Input.TextArea placeholder="Enter Address" />
            </Form.Item>
            <Form.Item
                label="Photo URL"
                name="photoUrl"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Photo URL',
                    },
                ]}
            >
                <Input placeholder="Photo URL" />
            </Form.Item>
            <Form.Item
                label="Sign URL"
                name="signUrl"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Sign URL',
                    },
                ]}
            >
                <Input placeholder="Sign URL" />
            </Form.Item>
            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                <Button type="primary" htmlType="submit" block>
                    Submit
                </Button>
            </Form.Item>

        </Form>
    );
};

export default UserProfile;
