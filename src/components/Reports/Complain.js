import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { notification } from "antd";
const EditableContext = React.createContext(null);
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
      console.log('Save failed:', errInfo);
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
const ComplainReport = ({ complain }) => {
  console.log(complain)
  const [api, contextHolder] = notification.useNotification();
  // const [dataSource, setDataSource] = useState([
  //   {
  //     key: '0',
  //     name: 'Edward King 0',
  //     age: '32',
  //     address: 'London, Park Lane no. 0',
  //   },
  //   {
  //     key: '1',
  //     name: 'Edward King 1',
  //     age: '32',
  //     address: 'London, Park Lane no. 1',
  //   },
  // ]);
  const formattedData = complain?.map((elec, i) => {
    // const infoDate = new Date(elec.infoDatePicker);

    return {
      key: `${i}`,
      _id: `${elec._id}`,
      year: `${elec.year}`,
      month: `${elec.month}`,
      numOffComplain: `${elec.numOffComplain}`,
      numOffSolvedComplain: `${elec.numOffSolvedComplain}`,
      Days3OverComplain: `${elec.Days3OverComplain}`,
   
    };
  });

  const [dataSource, setDataSource] = useState(formattedData);



  console.log(dataSource)
  const [count, setCount] = useState(dataSource?.length);
  const handleDelete = (_id) => {
    console.log(_id)
    const newData = dataSource.filter((item) => item._id !== _id);

    fetch(`https://pbsactivities.onrender.com/electricity/${_id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        // console.log(response)
        if (!response.ok) {
          const openNotificationWithIcon = (type) => {
            api[type]({
              message: "You Are Not Authorized to delete Previous Month item",
              description: "Unauthorized Access",
            });
          };
          openNotificationWithIcon('info')

        } else {
          setDataSource(newData);
        }
        console.log('Item deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        // Since the deletion on the backend failed, revert the data source update
        setDataSource(dataSource);
      });
  };
  const defaultColumns = [
    {
      title: 'Year',
      dataIndex: 'year',
      // width: '2%',
      // editable: true,
    },
    {
      title: 'Month',
      dataIndex: 'month',
    },
    {
      title: 'Number Off Complain',
      dataIndex: 'numOffComplain',
    },
    {
      title: 'Number Of Solved Complain',
      dataIndex: 'numOffSolvedComplain',
    },
    {
      title: '3Days Over Complain',
      dataIndex: 'Days3OverComplain',
    },
    // {
    //   title: 'Zonal',
    //   dataIndex: 'zonal_code',
    //   filters: distinctSubCategories.map(sc => ({
    //     text: sc,
    //     value: sc,
    //   })),
    //   onFilter: (value, record) => record?.subCategory?.subCategoryName?.indexOf(value) === 0,
    // },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
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
export default ComplainReport;
// .editable-cell {
//   position: relative;
// }

// .editable-cell-value-wrap {
//   padding: 5px 12px;
//   cursor: pointer;
// }

// .editable-row:hover .editable-cell-value-wrap {
//   padding: 4px 11px;
//   border: 1px solid #d9d9d9;
//   border-radius: 2px;
// }