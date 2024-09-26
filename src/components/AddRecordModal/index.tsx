import React from "react";
import { Modal, Form, Input, FormInstance } from "antd";

import { validationRules } from "../../utils/validationSchema";

interface AddRecordModalProps {
  isModalOpen: boolean;
  form: FormInstance;
  onAdd: (values: { name: string; age: number; address: string }) => void;
  onClose: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isModalOpen,
  form,
  onAdd,
  onClose,
}) => (
  <Modal
    title="Добавить запись"
    open={isModalOpen}
    onOk={() => form.submit()}
    onCancel={onClose}
  >
    <Form form={form} layout="vertical" onFinish={onAdd}>
      <Form.Item name="name" label="Имя" rules={validationRules.name}>
        <Input />
      </Form.Item>
      <Form.Item name="age" label="Возраст" rules={validationRules.age}>
        <Input
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldsValue({ age: value ? Number(value) : null });
          }}
        />
      </Form.Item>
      <Form.Item name="address" label="Адрес" rules={validationRules.address}>
        <Input />
      </Form.Item>
    </Form>
  </Modal>
);
