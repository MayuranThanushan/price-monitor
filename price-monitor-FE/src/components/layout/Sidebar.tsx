import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthStore'
import Button from '../ui/Button'

export default function Sidebar() {
	const { token, user, clearAuth } = useAuthStore()
	const nav = useNavigate()
	const logout = () => { clearAuth(); nav('/login') }
	return (
		<aside className='fixed top-0 left-0 h-screen w-60 bg-brandBlack text-white flex flex-col shadow-lg z-40'>
			<div className='px-5 py-6 text-center'>
				<div className='text-xl font-extrabold tracking-tight'>Price<span className='text-brandGreen'>Monitor</span></div>
			</div>
			<nav className='flex-1 px-2 space-y-1 overflow-y-auto pb-6'>
				<SidebarLink to='/dashboard' label='Dashboard' />
				<SidebarLink to='/trackers' label='Trackers' />
				<SidebarLink to='/offers' label='Offers' />
				<SidebarLink to='/alerts' label='Alerts' />
				<SidebarLink to='/config' label='Config' />
				{user?.role === 'admin' && <SidebarLink to='/admin/users' label='Users' />}
				{user?.role === 'admin' && <SidebarLink to='/api' label='API' />}
			</nav>
			<div className='px-4 py-4 border-t border-white/10 text-sm flex flex-col gap-2'>
            <Button variant='primary' size='sm' onClick={logout} className='px-3 py-1'>Logout</Button>
            <div className='text-xs text-white/70 text-center'>©2025. All rights reserved.</div>
			</div>
		</aside>
	)
}

interface SidebarLinkProps { to: string; label: string }
function SidebarLink({ to, label }: SidebarLinkProps){
	return (
		<NavLink
			to={to}
			end
			className={({ isActive }) => `group flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brandGreen text-white hover:text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
		>
			<span>{label}</span>
		</NavLink>
	)
}
