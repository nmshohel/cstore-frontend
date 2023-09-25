import React, { useState } from 'react';
import {
    Button,

    DatePicker,
    Form,

    InputNumber,
    Radio,
    Select,

} from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;
import { message, notification } from "antd";
import { useSession } from 'next-auth/react';
const TransformerAddForm = () => {
    
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
    fetch("http://localhost:5000/api/complainAdd", {
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
                <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Please select a year' }]}>
                    <Select required>
                        {/* <Select.Option ></Select.Option> */}
                        <Select.Option value="2023">2023</Select.Option>
                        <Select.Option value="2024">2024</Select.Option>
                        <Select.Option value="2026">2026</Select.Option>
                        <Select.Option value="2027">2027</Select.Option>
                        <Select.Option value="2028">2028</Select.Option>
                        <Select.Option value="2029">2029</Select.Option>
                        <Select.Option value="2030">2030</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Month" name="month" rules={[{ required: true, message: 'Please select a month' }]}>
                  <Select>
                  <Select.Option ></Select.Option>
                      <Select.Option value="01">January</Select.Option>
                      <Select.Option value="02">February</Select.Option>
                      <Select.Option value="03">March</Select.Option>
                      <Select.Option value="04">April</Select.Option>
                      <Select.Option value="05">May</Select.Option>
                      <Select.Option value="06">June</Select.Option>
                      <Select.Option value="07">July</Select.Option>
                      <Select.Option value="08">August</Select.Option>
                      <Select.Option value="09">September</Select.Option>
                      <Select.Option value="10">October</Select.Option>
                      <Select.Option value="11">November</Select.Option>
                      <Select.Option value="12">December</Select.Option>
                  </Select>
              </Form.Item>

                <Form.Item label="Number Of Complain" name="numOffComplain" rules={
                  [{ required: true, message: 'Please select a Number Of Complain' }]
                  }>
                    <InputNumber required style={{ width: '100%' }}/>
                </Form.Item>
                <Form.Item label="Number Of Solved Complain" name="numOffSolvedComplain" rules={
                  [{ required: true, message: 'Please select Number Of Solved Complain' }]
                  }>
                    <InputNumber required style={{ width: '100%' }}/>
                </Form.Item>
                <Form.Item label="3 Days Over Complain" name="Days3OverComplain" rules={
                  [{ required: true, message: 'Please select 3 Days Over Complain' }]
                  }>
                    <InputNumber required style={{ width: '100%' }}/>
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }}>
                  <Button type="primary" htmlType="submit" block>
                    Submit
                  </Button>
                </Form.Item>
               </Form>
        </ >
    );
};
export default TransformerAddForm;


