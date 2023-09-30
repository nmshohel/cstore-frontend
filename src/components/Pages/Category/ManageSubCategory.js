
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Modal, Select, Form, Input, Popconfirm, Table } from 'antd';
const EditableContext = React.createContext(null);
import { notification } from "antd";
import { Typography } from 'antd';
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
const ManageSubCategory = ({ subcategroys, categroys }) => {
  console.log(subcategroys);
  const [dataSource, setDataSource] = useState(subcategroys);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: 'Sub Category Name',
      dataIndex: 'subCategoryName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Category Name',
      dataIndex: ['category', 'categoryName'],
      width: '30%',
      editable: true,
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    // },
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
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const formInitialValues = selectedSubCategory
    ? {
      id: selectedSubCategory.id,
      categoryId: selectedSubCategory.categoryId,
      categoryName: selectedSubCategory.category.categoryName,
      subCategoryName: selectedSubCategory.subCategoryName,
    }
    : {};
  const showModal = (record) => {
    setSelectedSubCategory(record);
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
      <Title level={2}>Manage Sub Category</Title>
      {/* <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button> */}
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
          <Title level={2}>Update Sub Category</Title>
          <Form.Item
            label="Sub Category ID"
            name="id"
            hasFeedback

            rules={[
              {
                required: true,
                message: 'Please provide a Sub Category ID',
              },
            ]}
          >
            <Input placeholder="Sub Category ID" disabled />
          </Form.Item>
          <Form.Item label="Category" name="categoryId" hasFeedback rules={[
            {
              required: true,
              message: 'Please provide a Item Type name',
            },
          ]}>
            <Select placeholder="Select a Item Type" allowClear>
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
export default ManageSubCategory;