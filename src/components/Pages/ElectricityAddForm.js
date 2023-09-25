import React, { useState } from 'react';
import { Button, DatePicker, Form, InputNumber, Radio, Select } from 'antd';
import { Typography } from 'antd';
import { useSession } from 'next-auth/react';
import { message, notification } from "antd";
const { Title } = Typography;

const ElectricityAddForm = () => {
  const [componentSize, setComponentSize] = useState('default');
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    const zonal_code = session?.zonal_code?.zonal_code;
    const withvalues = { ...values, zonal_code };
    console.log(withvalues);
    fetch("https://pbsactivities.onrender.com/api/electricityAdd", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(withvalues),
    })
      .then((res) => res.json())
      .then((data) => {
        const openNotificationWithIcon = (type) => {
          api[type]({
            message: data.message,
            description: data?.data?.insertedId
              ? "Inserted ID: " + data?.data?.insertedId
              : "Inserted ID: ",
          });
        };
        openNotificationWithIcon(data?.data?.insertedId ? 'success' : 'info');
      });
  };

  return (
    <>
    {contextHolder}
      <Title>Electricity Info</Title>
      <Form
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 10,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
      >
        <Form.Item label="View" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small View</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="DatePicker" name="infoDatePicker">
          <DatePicker required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number Of 33KV Feder(OFF)" name="num33KVFederOff">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number Of 11KV Feder(OFF)" name="num11KVFederOff">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number Of Not Solved Complain" name="numOffNotSolvedComplain">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number Of Consumer Without Electricity" name="numOffConsumerWithoutElectricity">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number of Transformers Destroyed" name="numOffTransformersDestroyed">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number of Pending CMO" name="numOffPendingCmo">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number of Transformer Grounding" name="numOffTransformerGrounding">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Number of Transformer Fuse Change" name="numOffTransformerFuseChange">
          <InputNumber required style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Pre-planned Shutdown" name="prePlannedShutdown">
          <Select>
            <Select.Option value="yes">Yes</Select.Option>
            <Select.Option value="no">No</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Button">
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ElectricityAddForm;
