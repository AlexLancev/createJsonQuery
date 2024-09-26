import { FC, useCallback, useState } from "react";
import { Form, message } from "antd";
import { useUnit } from "effector-react";
import { v4 as uuidv4 } from "uuid";

import {
  $users,
  addUserMutation,
  deleteUserMutation,
  copyMutation,
} from "./redux";
import { DataType } from "./types";
import { TableComponent } from "./components/TableComponent";
import { AddRecordModal } from "./components/AddRecordModal";

export const App: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const users = useUnit($users);
  const [form] = Form.useForm<Omit<DataType, "key">>();

  const showModal = useCallback(() => setIsModalOpen(true), []);

  const handleAdd = useCallback(
    (values: Omit<DataType, "key">) => {
      try {
        const newUser: DataType = {
          key: uuidv4(),
          ...values,
        };

        console.log(newUser)
        addUserMutation.start(newUser);
        form.resetFields();
        setIsModalOpen(false);
        message.success("Пользователь успешно добавлен!");
      } catch {
        message.error("Ошибка при добавлении пользователя!");
      }
    },
    [form]
  );

  const handleDelete = useCallback((key: string) => {
    try {
      console.log(key);
      deleteUserMutation.start(key);
      message.success("Пользователь успешно удален!");
    } catch {
      message.error("Ошибка при удалении пользователя!");
    }
  }, []);

  const handleCopy = useCallback(
    (key: string) => {
      const userToCopy = users.find((user) => user.key === key);

      if (userToCopy) {
        try {
          const copiedUser: Partial<DataType> = {
            ...userToCopy,
            key: uuidv4(),
          };

          console.log(copiedUser)
          copyMutation.start(copiedUser);
          message.success("Копия пользователя создана!");
        } catch {
          message.error("Ошибка при создании копии пользователя!");
        }
      } else {
        message.error("Пользователь не найден!");
      }
    },
    [users]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setIsModalOpen(false);
  }, [form]);

  return (
    <>
      <TableComponent
        dataSource={users}
        onShowModal={showModal}
        onDelete={handleDelete}
        onCopy={handleCopy}
      />
      <AddRecordModal
        form={form}
        onAdd={handleAdd}
        onClose={handleCancel}
        isModalOpen={isModalOpen}
      />
    </>
  );
};
