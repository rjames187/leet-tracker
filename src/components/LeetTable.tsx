import React, { useState, useMemo } from 'react';
import { Table, Checkbox, Tag, Space, Typography, Input, Row, Col, Card, Button } from 'antd';
import { CheckOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { SortOrder } from 'antd/es/table/interface';

const { Title } = Typography;

// Define TypeScript interfaces
interface LeetCodeProblem {
  id: number;
  name: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

// Sample LeetCode problems data
const initialProblems: LeetCodeProblem[] = [
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minRating, setMinRating] = useState<number>(1000);
  const [maxRating, setMaxRating] = useState<number>(2200);
  
  // Get global min and max ratings for reference
  const globalMinRating = Math.min(...initialProblems.map(p => p.rating));
  const globalMaxRating = Math.max(...initialProblems.map(p => p.rating));
  
  // Filter problems based on search and rating range
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesKeyword = problem.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                           problem.difficulty.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesRating = problem.rating >= minRating && problem.rating <= maxRating;
      return matchesKeyword && matchesRating;
    });
  }, [problems, searchKeyword, minRating, maxRating]);

  // Clear all filters
  const clearFilters = () => {
    setSearchKeyword('');
    setMinRating(0);
    setMaxRating(Infinity);
  };
  const toggleCompleted = (id) => {
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
      render: (completed: boolean, record: LeetCodeProblem) => (
        <Checkbox
          checked={completed}
          onChange={() => toggleCompleted(record.id)}
        />
      ),
      // Custom sorter for boolean values
      sorter: (a: LeetCodeProblem, b: LeetCodeProblem) => Number(a.completed) - Number(b.completed),
      sortDirections: ['ascend' as SortOrder, 'descend' as SortOrder],
    },
    {
      title: 'Problem Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: LeetCodeProblem) => (
        <Space>
          {record.completed && <CheckOutlined style={{ color: '#52c41a' }} />}
          <span style={{ textDecoration: record.completed ? 'line-through' : 'none' }}>
            {text}
          </span>
        </Space>
      ),
      // Enable sorting by name
      sorter: (a: LeetCodeProblem, b: LeetCodeProblem) => a.name.localeCompare(b.name),
      sortDirections: ['ascend' as SortOrder, 'descend' as SortOrder],
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      // Enable sorting by rating (numeric)
      sorter: (a: LeetCodeProblem, b: LeetCodeProblem) => a.rating - b.rating,
      sortDirections: ['ascend' as SortOrder, 'descend' as SortOrder],
      // Set default sort order
      defaultSortOrder: 'ascend' as SortOrder,
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 120,
      render: (difficulty: LeetCodeProblem['difficulty']) => {
        const color = difficulty === 'Easy' ? 'green' : 
                     difficulty === 'Medium' ? 'orange' : 'red';
        return <Tag color={color}>{difficulty}</Tag>;
      },
      // Custom sorter for difficulty levels
      sorter: (a: LeetCodeProblem, b: LeetCodeProblem) => {
        const order: Record<LeetCodeProblem['difficulty'], number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return order[a.difficulty] - order[b.difficulty];
      },
      sortDirections: ['ascend' as SortOrder, 'descend' as SortOrder],
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2}>LeetCode Problems Tracker</Title>
      
      {/* Filter Controls */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Search Problems:
              </label>
              <Input
                placeholder="Search by name or difficulty..."
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                allowClear
              />
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={12}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Rating Range:
              </label>
              <Space>
                <Input
                  placeholder="Min rating"
                  type="number"
                  value={minRating}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value) || globalMinRating;
                    setMinRating(value);
                  }}
                  style={{ width: '120px' }}
                  min={globalMinRating}
                  max={globalMaxRating}
                />
                <span>to</span>
                <Input
                  placeholder="Max rating"
                  type="number"
                  value={maxRating}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value) || globalMaxRating;
                    setMaxRating(value);
                  }}
                  style={{ width: '120px' }}
                  min={globalMinRating}
                  max={globalMaxRating}
                />
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={24} md={4}>
            <div style={{ display: 'flex', alignItems: 'end', height: '100%' }}>
              <Button
                icon={<ClearOutlined />}
                onClick={clearFilters}
                style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}
              >
                Clear Filters
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Filter Summary */}
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <Space wrap>
            <span>Showing {filteredProblems.length} of {problems.length} problems</span>
            {searchKeyword && (
              <Tag color="blue" closable onClose={() => setSearchKeyword('')}>
                Search: "{searchKeyword}"
              </Tag>
            )}
            {(minRating !== globalMinRating || maxRating !== globalMaxRating) && (
              <Tag color="green" closable onClose={() => {
                setMinRating(globalMinRating);
                setMaxRating(globalMaxRating);
              }}>
                Rating: {minRating}-{maxRating}
              </Tag>
            )}
          </Space>
        </div>
      </Card>
      
      <Table
        columns={columns}
        dataSource={filteredProblems}
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
            Completed: {filteredProblems.filter(p => p.completed).length}
          </span>
          <span style={{ color: '#1890ff' }}>
            Remaining: {filteredProblems.filter(p => !p.completed).length}
          </span>
        </Space>
      </div>
    </div>
  );
};

export default LeetCodeTable;