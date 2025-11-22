import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';
import StateBlock from '../../components/ui/StateBlock';
import api from '../../api/axiosClient';
import { adminResetUserPassword, adminUpdateUser } from '../../api/authAPI';
import Button from '../../components/ui/Button';
import TextField from '../../components/forms/TextField';
import { Pencil, Key, Loader2 } from 'lucide-react';

interface UserItem { _id: string; name?: string; email: string; role: string; createdAt: string; }

export default function UserManagement(){
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery(['admin-users'], async () => {
    const res = await api.get('/api/admin/users');
    return res.data;
  });
  const users: UserItem[] = data?.data || [];
  const [editing, setEditing] = useState<UserItem|undefined>(undefined);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [resettingId, setResettingId] = useState<string|undefined>();

  const startEdit = (u:UserItem) => {
    setEditing(u);
    setForm({ name: u.name || '', email: u.email, role: u.role, password: '' });
    setErr('');
  };

  const mutationUpdate = useMutation(({ id, payload }:{ id:string; payload:any }) => adminUpdateUser(id, payload), {
    onSuccess: () => { setEditing(undefined); qc.invalidateQueries(['admin-users']); }
  });

  const mutationReset = useMutation((id:string) => adminResetUserPassword(id), {
    onSettled: () => { setResettingId(undefined); qc.invalidateQueries(['admin-users']); }
  });

  const saveEdit = async (e:any) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setErr('');
    try {
      await mutationUpdate.mutateAsync({ id: editing._id, payload: { name: form.name, email: form.email, role: form.role, password: form.password || undefined } });
    } catch (e:any) {
      setErr(e.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  const triggerReset = async (id:string) => {
    setResettingId(id);
    try { await mutationReset.mutateAsync(id); } catch (_) { /* ignore */ }
  };

  const EditModal = () => (
    <div className='fixed inset-0 z-30 flex items-center justify-center bg-black/30'>
      <form onSubmit={saveEdit} className='w-full max-w-md rounded-lg bg-white p-6 shadow'>
        <h2 className='text-lg font-semibold mb-4'>Edit User</h2>
        <div className='space-y-4'>
          <TextField id='name' name='name' label='Name' value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
          <TextField id='email' name='email' label='Email' type='email' value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} />
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>Role</label>
            <select value={form.role} onChange={e=>setForm({ ...form, role: e.target.value })} className='w-full rounded border border-gray-300 px-3 py-2 text-sm'>
              <option value='user'>user</option>
              <option value='admin'>admin</option>
            </select>
          </div>
          <TextField id='password' name='password' label='New Password (optional)' type='password' value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} />
          {err && <div className='text-xs text-red-600'>{err}</div>}
        </div>
        <div className='mt-6 flex gap-2'>
          <Button type='submit' variant='primary' size='sm' disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          <Button type='button' variant='secondary' size='sm' onClick={()=>setEditing(undefined)}>Cancel</Button>
        </div>
      </form>
    </div>
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean
          title='User Management'
          description='All registered users (admin only view).'
          className='mt-10'
        />
        <SectionClean className='mt-10'>
          {isLoading && <StateBlock variant='loading' />}
          {isError && <StateBlock variant='error' />}
          {!isLoading && !isError && users.length === 0 && (
            <StateBlock variant='empty' message='No users yet.' />
          )}
          {!isLoading && !isError && users.length > 0 && (
            <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white p-6'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 text-xs uppercase text-gray-600'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Name</th>
                    <th className='px-4 py-2 text-left'>Email</th>
                    <th className='px-4 py-2 text-left'>Role</th>
                    <th className='px-4 py-2 text-left'>Joined</th>
                    <th className='px-4 py-2 text-left'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className='border-t border-gray-100'>
                      <td className='px-4 py-2'>{u.name || '—'}</td>
                      <td className='px-4 py-2 font-mono text-xs'>{u.email}</td>
                      <td className='px-4 py-2'>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                      </td>
                      <td className='px-4 py-2 text-xs text-gray-500'>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className='px-4 py-2 space-x-2'>
                        <Button
                          variant='secondary'
                          aria-label='Edit user'
                          title='Edit user'
                          onClick={()=>startEdit(u)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          aria-label='Reset password'
                          title='Reset password'
                          disabled={resettingId===u._id}
                          onClick={()=>triggerReset(u._id)}
                        >
                          {resettingId===u._id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Key className='h-4 w-4' />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionClean>
        {editing && <EditModal />}
      </PageContainer>
    </DashboardLayout>
  );
}