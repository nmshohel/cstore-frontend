
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Input, Popconfirm, Table } from 'antd';
import { notification } from "antd";
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
const ManageSupplier = ({ suppliers }) => {
  console.log(suppliers);
  const { data: session } = useSession();
  const [dataSource, setDataSource] = useState(suppliers);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: 'Supplier Name',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to Update?" onConfirm={() => showModal(record)}>
            <a>Update</a>
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
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    if (selectedSupplier) {
      form.setFieldsValue({
        id: selectedSupplier.id,
        name: selectedSupplier.name,
        phone: selectedSupplier.phone,
        address: selectedSupplier.address,
      });
    }
  }, [selectedSupplier, form]);
  const showModal = (record) => {
    setSelectedSupplier(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedSupplier(null);
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
    const withvalues = { ...values, pbsCode };
    //console.log(withvalues);
    const accessToken = session?.accessToken?.accessToken;
    fetch(`http://localhost:5000/api/v1/supplier/${values?.id}`, {
      method: "PATCH",
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
      {/* <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button> */}
      <Title level={2}>Manage Supplier</Title>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        open={open}
        // title="Update Category"
        onCancel={handleCancel}
        footer={null}
      >
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish} form={form}>
          {contextHolder}
          <Title level={2}>Update Supplier</Title>
          <Form.Item
            label="Supplier ID"
            name="id"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please provide a supplier ID',
              },
            ]}
          >
            <Input placeholder="Supplier ID" disabled />
          </Form.Item>
          <Form.Item
            label="Supplier Name"
            name="name"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please provide a supplier name',
              },
            ]}
          >
            <Input placeholder="Supplier Name" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please provide a Phone Number',
              },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Address is required',
              },
            ]}
          >
            <Input.TextArea allowClear showCount />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
            <Button type="primary" htmlType="submit" block>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ManageSupplier;