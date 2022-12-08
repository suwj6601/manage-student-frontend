import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Space, Table, Button } from "antd";
import { message, Popconfirm } from "antd";
import { connect } from "react-redux";
import {
  actSaveGetListStudent,
  actSetSelectedStudent,
  actSetModalStudentOpen,
  actSaveReceiveMail,
} from "@/redux/action/student";
import { actSaveGetListClass } from "@/redux/action/class";
import { EditOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons";
import classApi from "@/api/class";
import ModalSendMail from "../Modal/ModalSendMail";
import studentApi from "@/api/student";

const TableStudent = (props) => {
  const { listStudent, listClass } = props;
  const [isTableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    onGetListClass();
  }, []);

  useEffect(() => {
    onGetAllStudent();
    onGetListClass();
  }, []);

  const onGetAllStudent = async () => {
    setTableLoading(true);
    const res = await studentApi.getListStudent();
    props.actSaveGetListStudent(res?.data || []);
    setTableLoading(false);
  };

  const onGetListClass = async () => {
    const res = await classApi.getListClass();
    props.actSaveGetListClass(res?.data || []);
  };

  // function edit, view Modal
  const onEditStudent = (infoStudent) => {
    props.actSetSelectedStudent(infoStudent);
    props.actSetModalStudentOpen(true);
  };

  const onDeleteStudent = async (idDelete) => {
    const res = await studentApi.deleteStudent({ idDelete });
    if (res?.code === 200) {
      onGetAllStudent();
      message.success("Delete success!");
    }
    // });
  };

  const onConfirmDelete = (idDelete) => {
    onDeleteStudent(idDelete);
  };

  // function send mail to student
  const sendMailToStudent = (receiveMail) => {
    props.actSaveReceiveMail(receiveMail);
  };

  // sort table
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChangeTable = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.length - b.id.length,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
      width: "70px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "160px",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
      width: "70px",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "160px",
    },
    {
      title: "Class",
      dataIndex: "classID",
      key: "classID",
      filters: listClass?.map((classInfo, index) => ({
        text: `Class ${classInfo.id}`,
        value: classInfo.id,
      })),
      filteredValue: filteredInfo.classID || null,
      onFilter: (value, record) =>
        filteredInfo?.classID?.includes(record?.classID),
      render: (value, record) => _.find(listClass, { id: value })?.name,
      width: "70px",
    },
    {
      title: "Gender",
      dataIndex: "sex",
      key: "sex",
      filters: [
        {
          text: "Male",
          value: "Male",
        },
        {
          text: "Female",
          value: "Female",
        },
      ],
      filteredValue: filteredInfo.sex || null,
      onFilter: (value, record) => record?.sex?.includes(value),
      width: "70px",
    },
    {
      title: "Action",
      key: "action",
      render: (_, infoStudent) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            style={{ margin: "0 10px" }}
            onClick={() => {
              onEditStudent(infoStudent);
            }}
          >
            Edit
          </Button>

          <Button
            type="primary"
            icon={<DeleteOutlined />}
            size="small"
            style={{ margin: "0 10px" }}
          >
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onConfirmDelete(infoStudent.id)}
              okText="Yes"
              cancelText="No"
            >
              <span
                style={{
                  color: "white",
                }}
              >
                Delete
              </span>
            </Popconfirm>
          </Button>

          <Button
            type="primary"
            icon={<MailOutlined />}
            size="small"
            onClick={() => sendMailToStudent(infoStudent.email)}
          >
            Mail
          </Button>
        </Space>
      ),
      width: "200px",
    },
  ];

  return (
    <div>
      <Table
        dataSource={listStudent}
        columns={columns}
        onChange={handleChangeTable}
      />

      <ModalSendMail />
    </div>
  );
};

export default connect(
  (store) => ({
    listStudent: store.Student.listStudent,
    listClass: store.Class.listClass,
  }),
  {
    actSaveGetListStudent,
    actSetSelectedStudent,
    actSetModalStudentOpen,
    actSaveReceiveMail,
    actSaveGetListClass,
  }
)(TableStudent);
