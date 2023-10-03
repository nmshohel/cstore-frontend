
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Popconfirm, Row, Table } from 'antd';
const EditableContext = React.createContext(null);
import { Typography } from 'antd';
import { notification } from "antd";
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
const RequestTransfer = ({ users }) => {
    //console.log(users);
    const { data: session } = useSession();
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
    const [api, contextHolder] = notification.useNotification();
    const handleRequest = (mobileNo) => {
        // console.log(key);
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/user/pbs-posting-request`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: accessToken,
            },
            body: JSON.stringify({ mobileNo }),
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
    const defaultColumns = [
        {
            title: 'User ID',
            dataIndex: 'mobileNo',
        },
        {
            title: 'Name',
            dataIndex: 'name',
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
        // {
        //     title: 'Zonal',
        //     dataIndex: ['zonals', 'zonalName'],
        // },
        // {
        //     title: 'Complain',
        //     dataIndex: ['complainCenter', 'complainName'],
        // },


        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to Transfer To Your PBS?" onConfirm={() => handleRequest(record?.mobileNo)}>
                        <a>Request</a>
                    </Popconfirm>
                ) : null,
        },
    ];
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
    const [searchText, setSearchText] = useState('');

    const handleSearch = async () => {
        // Perform your search action here using the searchText state
        console.log('Searching for:', searchText);
        const accessToken = session?.accessToken?.accessToken;
        fetch(`http://localhost:5000/api/v1/user/user/${searchText}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: accessToken,
            },
            // body: JSON.stringify(withvalues),
        })
            .then((res) => res.json())
            .then((data) => {
                setDataSource([data.data])

                console.log(data.data)
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
            <Title level={2}>Manage User</Title>
            <Row align="right">
                <Col >
                    <Input
                        placeholder="Phone "
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
            </Row>


            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};
export default RequestTransfer;