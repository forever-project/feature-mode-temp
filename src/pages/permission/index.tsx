import React, { useMemo, useState } from 'react';

import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';

type PermissionKey =
  | 'user:read'
  | 'user:write'
  | 'order:read'
  | 'order:write'
  | 'student:read'
  | 'student:write'
  | 'role:read'
  | 'role:write'
  | 'permission:assign';

type RoleRecord = {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionKey[];
  updatedAt: string;
};

const ALL_PERMISSIONS: Array<{
  key: PermissionKey;
  label: string;
  group: '用户' | '订单' | '学生' | '角色' | '权限';
}> = [
  { key: 'user:read', label: '查看用户', group: '用户' },
  { key: 'user:write', label: '管理用户', group: '用户' },
  { key: 'order:read', label: '查看订单', group: '订单' },
  { key: 'order:write', label: '管理订单', group: '订单' },
  { key: 'student:read', label: '查看学生', group: '学生' },
  { key: 'student:write', label: '管理学生', group: '学生' },
  { key: 'role:read', label: '查看角色', group: '角色' },
  { key: 'role:write', label: '管理角色', group: '角色' },
  { key: 'permission:assign', label: '分配权限', group: '权限' },
];

function nowIsoMinute() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function createId(prefix = 'role') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const PermissionPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<{ name: string; description?: string; permissions: PermissionKey[] }>();

  const [roles, setRoles] = useState<RoleRecord[]>(() => [
    {
      id: 'role_admin',
      name: '管理员',
      description: '拥有绝大多数管理权限',
      permissions: ALL_PERMISSIONS.map((p) => p.key),
      updatedAt: nowIsoMinute(),
    },
    {
      id: 'role_operator',
      name: '运营',
      description: '可查看并处理用户/订单/学生数据',
      permissions: ['user:read', 'order:read', 'order:write', 'student:read'],
      updatedAt: nowIsoMinute(),
    },
    {
      id: 'role_viewer',
      name: '只读',
      description: '仅查看，不可修改',
      permissions: ['user:read', 'order:read', 'student:read', 'role:read'],
      updatedAt: nowIsoMinute(),
    },
  ]);

  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const permissionByGroup = useMemo(() => {
    const groups: Record<string, typeof ALL_PERMISSIONS> = {};
    for (const p of ALL_PERMISSIONS) {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    }
    return groups;
  }, []);

  const filteredRoles = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => {
      const inText = `${r.name} ${r.description ?? ''}`.toLowerCase().includes(q);
      const inPerm = r.permissions.some((k) => k.toLowerCase().includes(q));
      return inText || inPerm;
    });
  }, [keyword, roles]);

  const columns: ProColumns<RoleRecord>[] = [
    {
      title: '角色',
      dataIndex: 'name',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.name}</Typography.Text>
          {record.description ? (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Typography.Text>
          ) : null}
        </Space>
      ),
    },
    {
      title: '权限点',
      dataIndex: 'permissions',
      render: (_, record) => {
        const mapped = record.permissions
          .map((k) => ALL_PERMISSIONS.find((p) => p.key === k))
          .filter(Boolean) as Array<(typeof ALL_PERMISSIONS)[number]>;
        const display = mapped.slice(0, 6);
        const rest = mapped.length - display.length;
        return (
          <Space size={[4, 8]} wrap>
            {display.map((p) => (
              <Tag key={p.key}>{p.label}</Tag>
            ))}
            {rest > 0 ? <Tag color="default">+{rest}</Tag> : null}
          </Space>
        );
      },
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                permissions: record.permissions,
              });
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该角色？"
            description="删除后不可恢复。"
            okText="删除"
            cancelText="取消"
            onConfirm={() => {
              setRoles((prev) => prev.filter((r) => r.id !== record.id));
              messageApi.success('已删除');
            }}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ permissions: [] });
    setModalOpen(true);
  };

  const upsertRole = async () => {
    const values = await form.validateFields();
    const name = values.name.trim();
    const description = values.description?.trim() || undefined;
    const permissions = values.permissions ?? [];

    setRoles((prev) => {
      if (!editingId) {
        const record: RoleRecord = {
          id: createId(),
          name,
          description,
          permissions,
          updatedAt: nowIsoMinute(),
        };
        return [record, ...prev];
      }
      return prev.map((r) =>
        r.id === editingId
          ? { ...r, name, description, permissions, updatedAt: nowIsoMinute() }
          : r,
      );
    });

    messageApi.success(editingId ? '已保存' : '已创建');
    setModalOpen(false);
  };

  const selectedPermissions = Form.useWatch('permissions', form) ?? [];
  const selectedSet = useMemo(() => new Set<PermissionKey>(selectedPermissions), [selectedPermissions]);

  const toggleGroup = (group: string, checked: boolean) => {
    const groupKeys = (permissionByGroup[group] ?? []).map((p) => p.key);
    const next = new Set<PermissionKey>(selectedPermissions);
    if (checked) {
      for (const k of groupKeys) next.add(k);
    } else {
      for (const k of groupKeys) next.delete(k);
    }
    form.setFieldsValue({ permissions: Array.from(next) });
  };

  return (
    <>
      {contextHolder}
      <PageContainer>
        <Card>
          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space wrap>
              <Input
                allowClear
                style={{ width: 320 }}
                placeholder="搜索角色/描述/权限 key，例如 user:read"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Typography.Text type="secondary">
                共 {filteredRoles.length} 个角色
              </Typography.Text>
            </Space>
            <Button type="primary" onClick={openCreate}>
              新建角色
            </Button>
          </Space>
          <Divider style={{ margin: '16px 0' }} />
          <ProTable<RoleRecord>
            rowKey="id"
            search={false}
            options={false}
            pagination={{ pageSize: 10 }}
            dataSource={filteredRoles}
            columns={columns}
          />
        </Card>

        <Modal
          title={editingId ? '编辑角色' : '新建角色'}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={upsertRole}
          okText="保存"
          cancelText="取消"
          width={720}
          destroyOnClose
        >
          <Form form={form} layout="vertical" preserve={false}>
            <Form.Item
              label="角色名称"
              name="name"
              rules={[
                { required: true, message: '请输入角色名称' },
                { max: 20, message: '最多 20 个字符' },
              ]}
            >
              <Input placeholder="例如：财务、客服、审计" />
            </Form.Item>
            <Form.Item label="角色描述" name="description" rules={[{ max: 80, message: '最多 80 个字符' }]}>
              <Input.TextArea placeholder="可选" autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <Typography.Text>权限点</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    已选 {selectedPermissions.length} 个
                  </Typography.Text>
                </Space>
              }
              name="permissions"
              rules={[{ required: true, message: '请至少选择 1 个权限点' }]}
            >
              <div>
                {Object.keys(permissionByGroup).map((group) => {
                  const keys = permissionByGroup[group].map((p) => p.key);
                  const checkedCount = keys.filter((k) => selectedSet.has(k)).length;
                  const allChecked = checkedCount === keys.length && keys.length > 0;
                  const indeterminate = checkedCount > 0 && checkedCount < keys.length;

                  return (
                    <div key={group} style={{ padding: '8px 0' }}>
                      <Space style={{ marginBottom: 8 }}>
                        <Checkbox
                          checked={allChecked}
                          indeterminate={indeterminate}
                          onChange={(e) => toggleGroup(group, e.target.checked)}
                        >
                          <Typography.Text strong>{group}</Typography.Text>
                        </Checkbox>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          {checkedCount}/{keys.length}
                        </Typography.Text>
                      </Space>
                      <Checkbox.Group style={{ display: 'block' }}>
                        <Space wrap size={[12, 8]}>
                          {permissionByGroup[group].map((p) => (
                            <Checkbox
                              key={p.key}
                              value={p.key}
                              checked={selectedSet.has(p.key)}
                              onChange={(e) => {
                                const next = new Set<PermissionKey>(selectedPermissions);
                                if (e.target.checked) next.add(p.key);
                                else next.delete(p.key);
                                form.setFieldsValue({ permissions: Array.from(next) });
                              }}
                            >
                              {p.label}{' '}
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                ({p.key})
                              </Typography.Text>
                            </Checkbox>
                          ))}
                        </Space>
                      </Checkbox.Group>
                    </div>
                  );
                })}
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
};

export default PermissionPage;

