import React from "react";
import { Table, Button, Space } from "antd";
import { DataType } from "../../types";

interface TableComponentProps {
  dataSource: DataType[];
  onShowModal: () => void;
  onDelete: (key: string) => void;
  onCopy: (key: string) => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  dataSource,
  onShowModal,
  onDelete,
  onCopy,
}) => {
  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Возраст",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Действие",
      key: "action",
      render: (_: unknown, record: DataType) => (
        <Space>
          <Button type="primary" onClick={() => onDelete(record.key)} danger>
            Удалить
          </Button>
          <Button type="primary" onClick={() => onCopy(record.key)}>
            Копировать
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={onShowModal}>
        Добавить пользователя
      </Button>
      <Table dataSource={dataSource} columns={columns} rowKey="key" />
    </>
  );
};
