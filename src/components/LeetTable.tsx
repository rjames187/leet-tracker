import React, { useState } from 'react';
import { Table, Checkbox, Tag, Space, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Sample LeetCode problems data
const initialProblems = [
  { id: 1, name: "Two Sum", rating: 1200, difficulty: "Easy", completed: false },
  { id: 2, name: "Add Two Numbers", rating: 1400, difficulty: "Medium", completed: true },
  { id: 3, name: "Longest Substring Without Repeating Characters", rating: 1500, difficulty: "Medium", completed: false },
  { id: 4, name: "Median of Two Sorted Arrays", rating: 2100, difficulty: "Hard", completed: false },
  { id: 5, name: "Longest Palindromic Substring", rating: 1600, difficulty: "Medium", completed: true },
  { id: 6, name: "ZigZag Conversion", rating: 1300, difficulty: "Medium", completed: false },
  { id: 7, name: "Reverse Integer", rating: 1100, difficulty: "Easy", completed: false },
  { id: 8, name: "String to Integer (atoi)", rating: 1400, difficulty: "Medium", completed: false },
  { id: 9, name: "Palindrome Number", rating: 1000, difficulty: "Easy", completed: true },
  { id: 10, name: "Regular Expression Matching", rating: 2200, difficulty: "Hard", completed: false },
  { id: 11, name: "Container With Most Water", rating: 1500, difficulty: "Medium", completed: false },
  { id: 12, name: "Integer to Roman", rating: 1200, difficulty: "Medium", completed: false },
  { id: 13, name: "Roman to Integer", rating: 1000, difficulty: "Easy", completed: false },
  { id: 14, name: "Longest Common Prefix", rating: 1100, difficulty: "Easy", completed: false },
  { id: 15, name: "3Sum", rating: 1700, difficulty: "Medium", completed: false }
];

const LeetCodeTable = () => {
  const [problems, setProblems] = useState(initialProblems);

  // Handle checkbox toggle
  const toggleCompleted = (id: number) => {
    setProblems(prev => 
      prev.map(problem => 
        problem.id === id 
          ? { ...problem, completed: !problem.completed }
          : problem
      )
    );
  };

  // Define table columns
  const columns = [
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      width: 100,
      render: (completed: boolean, record: any) => (
        <Checkbox
          checked={completed}
          onChange={() => toggleCompleted(record.id)}
        />
      ),
      // Custom sorter for boolean values
      sorter: (a: any, b: any) => a.completed - b.completed,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Problem Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {record.completed && <CheckOutlined style={{ color: '#52c41a' }} />}
          <span style={{ textDecoration: record.completed ? 'line-through' : 'none' }}>
            {text}
          </span>
        </Space>
      ),
      // Enable sorting by name
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      // Enable sorting by rating (numeric)
      sorter: (a, b) => a.rating - b.rating,
      sortDirections: ['ascend', 'descend'],
      // Set default sort order
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 120,
      render: (difficulty) => {
        const color = difficulty === 'Easy' ? 'green' : 
                     difficulty === 'Medium' ? 'orange' : 'red';
        return <Tag color={color}>{difficulty}</Tag>;
      },
      // Custom sorter for difficulty levels
      sorter: (a, b) => {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return order[a.difficulty] - order[b.difficulty];
      },
      sortDirections: ['ascend', 'descend'],
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2}>LeetCode Problems Tracker</Title>
      
      <Table
        columns={columns}
        dataSource={problems}
        rowKey="id"
        pagination={{
          pageSize: 10, // Show 10 items per page
          showSizeChanger: true, // Allow user to change page size
          showQuickJumper: true, // Allow user to jump to specific page
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} problems`,
          pageSizeOptions: ['5', '10', '20', '50'], // Page size options
        }}
        size="middle"
        bordered
        // Optional: Add row selection for bulk operations
        // rowSelection={{
        //   type: 'checkbox',
        //   onChange: (selectedRowKeys, selectedRows) => {
        //     console.log('Selected:', selectedRows);
        //   },
        // }}
      />
      
      {/* Summary statistics */}
      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'white', borderRadius: '6px' }}>
        <Space size="large">
          <span>Total Problems: {problems.length}</span>
          <span style={{ color: '#52c41a' }}>
            Completed: {problems.filter(p => p.completed).length}
          </span>
          <span style={{ color: '#1890ff' }}>
            Remaining: {problems.filter(p => !p.completed).length}
          </span>
        </Space>
      </div>
    </div>
  );
};

export default LeetTable;