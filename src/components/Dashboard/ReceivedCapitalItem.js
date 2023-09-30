
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Input, Popconfirm, Table, DatePicker, Select } from 'antd';
import { notification } from "antd";
import moment from 'moment';
const EditableContext = React.createContext(null);
import { Typography } from 'antd';
import { useSession } from 'next-auth/react';
const { Title } = Typography;
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            //console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
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
const ReceivedCapitalItem = ({ notReceiveCapitalItem, capitalItem, itemType, categroys, subcategroys, brands, models, suppliers }) => {
    console.log(notReceiveCapitalItem);
    const { data: session } = useSession();
    const [filteredCategory, setFilteredCategory] = useState([]);
    const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    const [filteredModel, setModel] = useState([]);
    console.log(filteredCategory, filteredSubCategory)
    const handleCategory = (key) => {
        const newData = categroys?.filter((item) => item.itemTypeId == key);
        setFilteredCategory(newData);
    };
    const handleSubCategory = (key) => {
        const newData = subcategroys?.filter((item) => item.categoryId == key);
        setFilteredSubCategory(newData);
    };

    const handleModel = (key) => {
        const newData = models.filter((item) => item.brandId === key); // Use strict equality (===)
        setModel(newData);
    };
    const [distinctSubCategories, setDistinctSubCategories] = useState([]);
    const [distinctCategories, setDistinctCategories] = useState([]);
    const [distinctZonals, setdistinctZonals] = useState([]);

    useEffect(() => {
        const subCategoryNames = Array.from(new Set(notReceiveCapitalItem.map(item => item?.subCategory?.subCategoryName)));
        setDistinctSubCategories(subCategoryNames);
        const CategoryNames = Array.from(new Set(notReceiveCapitalItem.map(item => item?.category?.categoryName)));
        setDistinctCategories(CategoryNames);
        const zonalNames = Array.from(new Set(notReceiveCapitalItem.map(item => item?.zonals?.zonalName)));
        setdistinctZonals(zonalNames);
    }, [capitalItem]);
    //console.log(distinctCategories);
    const [dataSource, setDataSource] = useState(notReceiveCapitalItem);
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Description',
            dataIndex: 'description',
            // width: '20%',
            editable: true,
        },
        {
            title: 'Serial',
            dataIndex: 'serialNo',
        },
        {
            title: 'Brand',
            dataIndex: ['brand', 'brandName'],
        },

        {
            title: 'Model',
            dataIndex: ['model', 'modelName'],
        },
        {
            title: 'Warranty',
            dataIndex: 'warranty',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },

        {
            title: 'Category',
            dataIndex: ['category', 'categoryName'],
            filters: distinctCategories.map(sc => ({
                text: sc,
                value: sc,
            })),
            onFilter: (value, record) => record.category.categoryName.indexOf(value) === 0,
        },
        {
            title: 'Sub Category',
            dataIndex: ['subCategory', 'subCategoryName'],
            filters: distinctSubCategories.map(sc => ({
                text: sc,
                value: sc,
            })),
            onFilter: (value, record) => record?.subCategory?.subCategoryName?.indexOf(value) === 0,
        },
        {
            title: 'Zonal',
            dataIndex: ['zonals', 'zonalName'],
            filters: distinctZonals.map(sc => ({
                text: sc,
                value: sc,
            })),
            onFilter: (value, record) => record.zonals.zonalName.indexOf(value) === 0,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Have You Recevied The Product?" onConfirm={() => onFinish(record)}>
                        <a>Receive</a>
                    </Popconfirm>
                ) : null,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record?.id)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };
    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    const [open, setOpen] = useState(false);
    const [selectedCapitalItem, setSelectedCapitalItem] = useState(null);
    const [form] = Form.useForm();
    useEffect(() => {
        if (selectedCapitalItem) {
            // const specificDate = moment(selectedCapitalItem.purchasedate, 'YYYY-MM-DD');
            form.setFieldsValue({
                id: selectedCapitalItem.id,
                serialNo: selectedCapitalItem.serialNo,
                description: selectedCapitalItem.description,
                purchasedate: moment(selectedCapitalItem.purchasedate, 'YYYY-MM-DD'),
                price: selectedCapitalItem.price,
                identificationNo: selectedCapitalItem.identificationNo,
                warranty: selectedCapitalItem.warranty,
                status: selectedCapitalItem.status,
                itemTypeId: selectedCapitalItem.itemTypeId,
                categoryId: selectedCapitalItem.categoryId,
                subCategoryid: selectedCapitalItem.subCategoryid,
                brandId: selectedCapitalItem.brandId,
                modelId: selectedCapitalItem.modelId,
                supplierId: selectedCapitalItem.supplierId,
            });
        }
    }, [selectedCapitalItem, form]);
    const showModal = (record) => {
        setSelectedCapitalItem(record);
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedCapitalItem(null);
    };
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
    const [api, contextHolder] = notification.useNotification();
    const onFinish = (values) => {
        console.log(values)
        const pbsCode = session?.pbs_code?.pbs_code;
        const receivedByMobileNo = session?.mobileNo?.mobileNo;
        const withvalues = { ...values, pbsCode, receivedByMobileNo };
        console.log(withvalues);
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/capital-item/receive-capital-item/${values?.id}`, {
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
                setOpen(false);
            });
    };
    return (
        <div>
            {contextHolder}
            {/* <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button> */}
            <Title level={2}>Certify Capital Item</Title>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                onChange={onChange}
            />
            {/* <Modal
                open={open}
                // title="Update Category"
                onCancel={handleCancel}
                footer={null}
            >

                <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish} form={form}>
                    {contextHolder}
                    <Title level={2}>Certify Capital Item</Title>

                    <Form.Item
                        label="Product ID"
                        name="id"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please provide a ID',
                            },
                        ]}
                    >
                        <Input placeholder="Product ID" disabled />
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
                </Form>
            </Modal> */}
        </div>
    );
};
export default ReceivedCapitalItem;