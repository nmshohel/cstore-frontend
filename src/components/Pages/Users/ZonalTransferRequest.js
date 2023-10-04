
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
const ZonalTransferRequest = ({ itemType, categroys, subcategroys, brands, models, suppliers, notAssignCapitalItem, users, zonals }) => {
    console.log(zonals);
    console.log(users);
    const { data: session } = useSession();
    // const [filteredCategory, setFilteredCategory] = useState([]);
    // const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    // const [filteredModel, setModel] = useState([]);
    // console.log(filteredCategory, filteredSubCategory)
    // const handleCategory = (key) => {
    //     const newData = categroys?.filter((item) => item.itemTypeId == key);
    //     setFilteredCategory(newData);
    // };
    // const handleSubCategory = (key) => {
    //     const newData = subcategroys?.filter((item) => item.categoryId == key);
    //     setFilteredSubCategory(newData);
    // };
    // const handleUsers = (key) => {
    //     const newData = users?.filter((item) => item.zonalCode == key);
    //     setFilteredUsers(newData);
    // };

    const handleModel = (key) => {
        const newData = models.filter((item) => item.brandId === key); // Use strict equality (===)
        setModel(newData);
    };
    const [distinctSubCategories, setDistinctSubCategories] = useState([]);
    const [distinctCategories, setDistinctCategories] = useState([]);
    const [distinctZonals, setdistinctZonals] = useState([]);

    // useEffect(() => {
    //     const subCategoryNames = Array.from(new Set(notAssignCapitalItem?.map(item => item?.subCategory?.subCategoryName)));
    //     setDistinctSubCategories(subCategoryNames);
    //     const CategoryNames = Array.from(new Set(notAssignCapitalItem?.map(item => item?.category?.categoryName)));
    //     setDistinctCategories(CategoryNames);
    //     const zonalNames = Array.from(new Set(notAssignCapitalItem?.map(item => item?.zonals?.zonalName)));
    //     setdistinctZonals(zonalNames);
    // }, [notAssignCapitalItem]);
    console.log(distinctCategories);
    const [dataSource, setDataSource] = useState(users);
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'User ID',
            dataIndex: 'mobileNo',
        },
        {
            title: 'Name',
            dataIndex: ['employee', 'name'],
            width: '20%',
            editable: true,
        },
        {
            title: 'Designation',
            dataIndex: ['employee', 'designation'],
        },
        {
            title: 'PBS',
            dataIndex: ['pbs', 'pbsName'],
        },
        {
            title: 'Zonal',
            dataIndex: ['zonals', 'zonalName'],
        },
        {
            title: 'Complain',
            dataIndex: ['complainCenter', 'complainName'],
        },

        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to Transfer?" onConfirm={() => showModal(record)}>
                        <a>Transfer</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    // const defaultColumns = [
    //     {
    //         title: 'Description',
    //         dataIndex: 'description',
    //         // width: '20%',
    //         editable: true,
    //     },
    //     {
    //         title: 'Serial',
    //         dataIndex: 'serialNo',
    //     },
    //     {
    //         title: 'Brand',
    //         dataIndex: ['brand', 'brandName'],
    //     },

    //     {
    //         title: 'Model',
    //         dataIndex: ['model', 'modelName'],
    //     },
    //     {
    //         title: 'Warranty',
    //         dataIndex: 'warranty',
    //     },
    //     {
    //         title: 'Price',
    //         dataIndex: 'price',
    //     },

    //     {
    //         title: 'Category',
    //         dataIndex: ['category', 'categoryName'],
    //         filters: distinctCategories.map(sc => ({
    //             text: sc,
    //             value: sc,
    //         })),
    //         onFilter: (value, record) => record.category.categoryName.indexOf(value) === 0,
    //     },
    //     {
    //         title: 'Sub Category',
    //         dataIndex: ['subCategory', 'subCategoryName'],
    //         filters: distinctSubCategories.map(sc => ({
    //             text: sc,
    //             value: sc,
    //         })),
    //         onFilter: (value, record) => record?.subCategory?.subCategoryName?.indexOf(value) === 0,
    //     },
    //     {
    //         title: 'Zonal',
    //         dataIndex: ['zonals', 'zonalName'],
    //         filters: distinctZonals.map(sc => ({
    //             text: sc,
    //             value: sc,
    //         })),
    //         onFilter: (value, record) => record.zonals.zonalName.indexOf(value) === 0,
    //     },
    //     {
    //         title: 'operation',
    //         dataIndex: 'operation',
    //         render: (_, record) =>
    //             dataSource.length >= 1 ? (
    //                 <Popconfirm title="Sure to Issue?" onConfirm={() => showModal(record)}>
    //                     <a>Issue</a>
    //                 </Popconfirm>
    //             ) : null,
    //     },
    //     {
    //         title: 'operation',
    //         dataIndex: 'operation',
    //         render: (_, record) =>
    //             dataSource.length >= 1 ? (
    //                 <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record?.id)}>
    //                     <a>Delete</a>
    //                 </Popconfirm>
    //             ) : null,
    //     },
    // ];
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
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    useEffect(() => {
        if (selectedUser) {
            // const specificDate = moment(selectedCapitalItem.purchasedate, 'YYYY-MM-DD');
            form.setFieldsValue({
                mobileNo: selectedUser.mobileNo,
                name: selectedUser.employee.name,
                designation: selectedUser.employee.designation,
            });
        }
    }, [selectedUser, form]);
    const showModal = (record) => {
        console.log(record)
        setSelectedUser(record);
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedUser(null);
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
        const { mobileNo, zonalCode } = values;
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/user/zonal-posting-request`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: accessToken,
            },
            body: JSON.stringify({ mobileNo, zonalCode }),
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
            <Title level={2}>Request Zonal Transfer</Title>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                onChange={onChange}
            />
            <Modal
                open={open}
                // title="Update Category"
                onCancel={handleCancel}
                footer={null}
            >

                <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish} form={form}>
                    {contextHolder}
                    <Title level={2}>Request Transfer(Zonal)</Title>
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
                        <Input placeholder="Name" disabled />
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


                    <Form.Item label="Zonal" name="zonalCode" hasFeedback rules={[
                        {
                            required: true,
                            message: 'Please provide a Zonal',
                        },
                    ]}>
                        <Select placeholder="Select a Zonal" allowClear >
                            {zonals?.map((category) => (
                                <Option value={category.zonalCode} key={category.id}>
                                    {category.zonalName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                        <Button type="primary" htmlType="submit" block>
                            Request
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ZonalTransferRequest;