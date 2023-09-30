import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from 'antd';
const EditableContext = React.createContext(null);
import { Typography } from 'antd';
import { notification } from "antd";
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
const ManageCategory = ({ categroys, itemType }) => {
  console.log(categroys);
  const [dataSource, setDataSource] = useState(categroys);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Item Type',
      dataIndex: ['itemType', 'itemType'],
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const formInitialValues = selectedCategory
    ? {
      id: selectedCategory.id,
      itemTypeId: selectedCategory.itemType.id,
      categoryName: selectedCategory.categoryName,
    }
    : {};
  const showModal = (record) => {
    setSelectedCategory(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
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
  };
  return (
    <div>
      <Title level={2}>Manage Category</Title>

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
        <Form {...formItemLayout} style={{ maxWidth: 600 }} onFinish={onFinish} initialValues={formInitialValues}>
          {contextHolder}
          <Title level={2}>Update Category</Title>
          <Form.Item
            label="Category ID"
            name="id"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please provide a Category ID',
              },
            ]}
          >
            <Input placeholder="Category ID" />
          </Form.Item>
          <Form.Item label="Item Type" name="itemTypeId" hasFeedback rules={[
            {
              required: true,
              message: 'Please provide a Item Type name',
            },
          ]}>
            <Select placeholder="Select a Item Type" allowClear>
              {itemType.map((brand) => (
                <Option value={brand.id} key={brand.id}>
                  {brand.itemType}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Category Name"
            name="categoryName"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please provide a Category name',
              },
            ]}
          >
            <Input placeholder="Category Name" />
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
export default ManageCategory;