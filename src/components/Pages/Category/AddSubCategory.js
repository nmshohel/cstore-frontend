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

const AddSubCategory = ({ categroys }) => {
    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const onFinish = (values) => {
        //console.log('Received values:', values);
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/sub-category/create-sub-category`, {
            method: "POST",
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
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish}>
            {contextHolder}
            <Title level={2}>Add Sub Category</Title>
            <Form.Item label="Category" name="categoryId" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Category name',
                },
            ]}>
                <Select placeholder="Select a Category" allowClear>
                    {categroys.map((brand) => (
                        <Option value={brand.id} key={brand.id}>
                            {brand.categoryName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Sub Category Name"
                name="subCategoryName"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Sub Category name',
                    },
                ]}
            >
                <Input placeholder="Sub Category Name" />
            </Form.Item>
            <Form.Item
                label="Item Code"
                name="itemCode"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Item Code',
                    },
                ]}
            >
                <Input placeholder="Item Code" />
            </Form.Item>

            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                <Button type="primary" htmlType="submit" block>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddSubCategory;
