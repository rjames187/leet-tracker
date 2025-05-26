import React, { useState, useMemo, useEffect } from 'react';
import { Table, Checkbox, Tag, Space, Typography, Input, Row, Col, Card, Button } from 'antd';
import { CheckOutlined, SearchOutlined, ClearOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { SortOrder } from 'antd/es/table/interface';
import type { LeetCodeProblem } from '../types';
import { getData } from '../data';
import Link from 'antd/es/typography/Link';

const { Title } = Typography;

const LeetCodeTable = () => {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minRating, setMinRating] = useState<number>(1000);
  const [maxRating, setMaxRating] = useState<number>(2200);
  
  // Get global min and max ratings for reference
  const globalMinRating = 1000;
  const globalMaxRating = 2000;

  useEffect(() => {
      (async () => {
        try {
          const data = await getData();
          console.log('Fetched problems:', data.length);
          setProblems(data);
          setMinRating(Math.round(Math.min(...data.map(p => p.rating))));
          setMaxRating(Math.round(Math.max(...data.map(p => p.rating))));
        } catch (error) {
          console.error('Error fetching problem data:', error);
        }
      })();
  }, []);
  
  // Filter problems based on search and rating range
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesKeyword = problem.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                           problem.difficulty.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesRating = problem.rating >= minRating - 1 && problem.rating <= maxRating + 1;
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

    const stored = localStorage.getItem(`${id}`);
    if (stored === 't') {
      localStorage.setItem(`${id}`, 'f');
    } else {
      localStorage.setItem(`${id}`, 't');
    }
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
      title: 'Link',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: number, record: LeetCodeProblem) => {
        const url = `https://leetcode.com/problems/${record.slug}`;
        return (
          <Link href={url} >
            <PlayCircleOutlined />
            {' '}{id}
          </Link>
        );
      },
      sorter: (a: LeetCodeProblem, b: LeetCodeProblem) => a.id - b.id,
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
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (<>{Math.round(rating)}</>),
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
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh', minWidth: '70vw' }}>
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