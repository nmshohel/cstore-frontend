import React, { useEffect, useState } from 'react';
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
const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!',
        },
    ],
};

const AddRevenueItem = ({ itemType, categroys, subcategroys, brands, models, suppliers }) => {
    console.log(itemType)
    // cole.log(models)
    const [filteredCategory, setFilteredCategory] = useState([]);
    const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    const [filteredModel, setModel] = useState([]);

    const handleCategory = (key) => {
        const newData = categroys.filter((item) => item.itemTypeId == key);
        setFilteredCategory(newData);
    };
    const handleSubCategory = (key) => {
        const newData = subcategroys.filter((item) => item.categoryId == key);
        setFilteredSubCategory(newData);
    };

    const handleModel = (key) => {
        const newData = models.filter((item) => item.brandId === key); // Use strict equality (===)
        setModel(newData);
    };

    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const onFinish = (values) => {
        //console.log('Received values:', values);
        const pbsCode = session?.pbs_code?.pbs_code;
        const addByMobileNo = session?.mobileNo?.mobileNo;
        const withvalues = { ...values, pbsCode, addByMobileNo };
        console.log(withvalues)
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/revenue-item/create-revenue-item`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: accessToken,
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

    return (
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish}>
            {contextHolder}
            <Title level={2}>Add Revenue Item</Title>
            {/* <Form.Item
                label="Product Name"
                name="name"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Product Name',
                    },
                ]}
            >
                <Input placeholder="Product Name" />
            </Form.Item> */}
            <Form.Item
                label="Serial Number"
                name="serialNo"
                hasFeedback
                rules={[
                    {
                        // required: true,
                        message: 'Please provide a Serial Number',
                    },
                ]}
            >
                <Input placeholder="Serial Number" />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Description',
                    },
                ]}
            >
                <Input placeholder="Description" />
            </Form.Item>

            <Form.Item name="purchasedate" label="Parchase Date" {...config}>
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                label="Price"
                name="price"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please provide a Price',
                    },
                ]}
            >
                <Input placeholder="Price" />
            </Form.Item>



            <Form.Item label="Warranty" name="warranty" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Warranty',
                },
            ]}>
                <Select placeholder="Select a Warranty" allowClear>
                    <Option value='none'>None</Option>
                    <Option value='1 years'>1 Years</Option>
                    <Option value='2 years'>2 Years</Option>
                    <Option value='3 years'>3 Years</Option>
                    <Option value='4 years'>4 Years</Option>
                    <Option value='5 years'>5 Years</Option>
                    <Option value='6 years'>6 Years</Option>
                    <Option value='7 years'>7 Years</Option>
                    <Option value='8 years'>8 Years</Option>
                    <Option value='9 years'>9 Years</Option>
                    <Option value='10 years'>10 Years</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Status" name="status" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Status',
                },
            ]}>
                <Select placeholder="Select a Status" allowClear>
                    <Option value='Active'>Active</Option>
                    <Option value='In Active'>In Active</Option>
                    <Option value='Damaged'>Damaged</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Item Type" name="itemTypeId" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Item Type name',
                },
            ]}>
                <Select placeholder="Select a Item Type" allowClear onChange={(value) => handleCategory(value)}>
                    {itemType.map((brand) => (brand.itemType === 'Revenue' &&
                        <Option value={brand.id} key={brand.id}>
                            {brand.itemType}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Category" name="categoryId" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Category name',
                },
            ]}>
                <Select placeholder="Select a Category" allowClear onChange={(value) => handleSubCategory(value)}>
                    {filteredCategory.map((category) => (
                        <Option value={category.id} key={category.id}>
                            {category.categoryName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Sub Category" name="subCategoryid" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Sub Category name',
                },
            ]}>
                <Select placeholder="Select a Sub Category" allowClear>
                    {filteredSubCategory.map((subcategroy) => (
                        <Option value={subcategroy.id} key={subcategroy.id}>
                            {subcategroy.subCategoryName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Brand" name="brandId" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Brand name',
                },
            ]}>
                <Select placeholder="Select a Brand" allowClear onChange={(value) => handleModel(value)}>
                    {brands.map((brand) => (
                        <Option value={brand.id} key={brand.id}>
                            {brand.brandName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Model"
                name="modelId"
                hasFeedback
                rules={[
                    {
                        // required: true,
                        message: 'Please provide a Model name',
                    },
                ]}
            >
                <Select placeholder="Select a Model" allowClear >
                    {filteredModel.map((model) => (
                        <Select.Option value={model.id} key={model.id}>
                            {model.modelName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Supplier" name="supplierId" hasFeedback rules={[
                {
                    required: true,
                    message: 'Please provide a Supplier name',
                },
            ]}>
                <Select placeholder="Select a Supplier" allowClear>
                    {suppliers.map((brand) => (
                        <Option value={brand.id} key={brand.id}>
                            {brand.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                <Button type="primary" htmlType="submit" block>
                    Submit
                </Button>
            </Form.Item>
        </Form >
    );
};

export default AddRevenueItem;
