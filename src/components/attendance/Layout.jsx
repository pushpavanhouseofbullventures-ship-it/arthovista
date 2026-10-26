import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD
import Logo from '../Logo';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
=======
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
>>>>>>> origin/main
  Megaphone,
  Briefcase,
  UserCheck,
  ArrowLeft,
<<<<<<< HEAD
  User,
  BookOpen,
  Mail
} from 'lucide-react';
=======
  User
} from 'lucide-react';
import StarfieldBackground from '../StarfieldBackground';
>>>>>>> origin/main

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
<<<<<<< HEAD
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark' ? false : false);

  // Sync theme to root DOM (default to clean white enterprise mode)
=======
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Sync theme to root DOM
>>>>>>> origin/main
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Sidebar navigation configuration based on role
  const navigation = (user?.role === 'Admin' || user?.role === 'Manager') ? [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Leaves Board', href: '/admin/leaves', icon: Briefcase },
    { name: 'Holidays & Events', href: '/admin/holidays', icon: Calendar },
    { name: 'Broadcasts', href: '/admin/announcements', icon: Megaphone },
<<<<<<< HEAD
    { name: 'Blog Studio', href: '/admin/blogs', icon: BookOpen },
    { name: 'Gazette Studio', href: '/admin/newsletters', icon: Mail },
=======
>>>>>>> origin/main
    { name: 'Reports & Logs', href: '/admin/reports', icon: FileText },
    { name: 'My Profile', href: '/admin/profile', icon: User },
  ] : [
    { name: 'Dashboard', href: '/employee', icon: LayoutDashboard },
    { name: 'Mark Attendance', href: '/employee/attendance', icon: UserCheck },
    { name: 'My Leaves', href: '/employee/leaves', icon: Briefcase },
    { name: 'Holidays & Events', href: '/employee/holidays', icon: Calendar },
    { name: 'Announcements', href: '/employee/announcements', icon: Megaphone },
    { name: 'My Profile', href: '/employee/profile', icon: User },
  ];

  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-200">

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
=======
    <div className="flex h-screen bg-[#07192f] text-slate-100 font-sans relative overflow-hidden">
      <StarfieldBackground />
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
>>>>>>> origin/main
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
<<<<<<< HEAD
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 transform shadow-xs
=======
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-800/80 bg-slate-900/90 backdrop-blur-md transition-transform duration-300 transform 
>>>>>>> origin/main
        lg:translate-x-0 lg:static lg:inset-auto 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Banner */}
<<<<<<< HEAD
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800">
          <Logo size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
=======
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-500 to-indigo-600 text-white shadow-md shadow-primary-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-300">
              AttendanceHub
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
>>>>>>> origin/main
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
<<<<<<< HEAD
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
=======
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
>>>>>>> origin/main
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
<<<<<<< HEAD
                  flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 group
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold border border-primary-200/70 dark:border-primary-800/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'}
                `}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
=======
                  flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-teal-500/25 text-teal-300 font-bold border border-teal-500/50 shadow-md shadow-teal-500/10' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/90'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-teal-400' : 'text-slate-300 group-hover:text-white'}`} />
>>>>>>> origin/main
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to main portal link & User Card */}
<<<<<<< HEAD
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Main Website
          </Link>

          <Link
            to={user?.role === 'Admin' || user?.role === 'Manager' ? '/admin/profile' : '/employee/profile'}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 shadow-2xs"
            title="View Profile Console"
          >
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold overflow-hidden border border-primary-200 dark:border-primary-700 shrink-0 group-hover:scale-105 transition-transform">
=======
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" />
            Main Website
          </Link>

          <Link 
            to={user?.role === 'Admin' || user?.role === 'Manager' ? '/admin/profile' : '/employee/profile'}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors group border border-slate-800/80 bg-slate-950/40"
            title="View Profile Console"
          >
            <div className="w-9 h-9 rounded-full bg-teal-800/60 flex items-center justify-center font-bold text-white overflow-hidden border border-teal-500/40 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
>>>>>>> origin/main
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
<<<<<<< HEAD
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-primary-600 transition-colors">{user?.fullName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate capitalize">{user?.role} • {user?.designation || 'Staff'}</p>
=======
              <p className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">{user?.fullName}</p>
              <p className="text-[11px] text-slate-300 font-medium truncate capitalize">{user?.role} • {user?.designation || 'Staff'}</p>
>>>>>>> origin/main
            </div>
          </Link>

          <button
            onClick={handleLogout}
<<<<<<< HEAD
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 rounded-xl transition-colors cursor-pointer"
=======
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl transition-colors duration-200 cursor-pointer"
>>>>>>> origin/main
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Container */}
<<<<<<< HEAD
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 bg-[#f8fafc] dark:bg-slate-950">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block tracking-tight">
=======
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-30 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-200 hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black text-white hidden sm:block tracking-wide">
>>>>>>> origin/main
              {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

<<<<<<< HEAD
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
=======
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
>>>>>>> origin/main
            </button>

            {/* Notification Trigger */}
            <button
<<<<<<< HEAD
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
=======
              className="relative p-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-900" />
>>>>>>> origin/main
            </button>
          </div>
        </header>

        {/* Page Inner Content Container */}
<<<<<<< HEAD
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc] dark:bg-slate-950">
=======
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/40 backdrop-blur-[2px]">
>>>>>>> origin/main
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
