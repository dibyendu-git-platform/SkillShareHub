import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in localStorage');
      return null; // or handle the case where no token is available
    }
    axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`,{
      //...data
      },{
      //Adding token to the request
      headers: {
      'Authorization': `Bearer ${token}`
      }
      }).then((response) => {
        // Handle successful logout 
        console.log(response)  
        dispatch(logout());
      }).catch((error) => {
        // Handle logout error
        console.error('Logout error:', error?.response?.data?.message);
      });
    
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-primary">
                    <img src="/SkillShareHub.svg" className='size-20'alt="Logo"/>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary text-black flex items-center justify-center">
                        {user?.name?.toUpperCase()}
                      </div>
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </MenuItem>
                        {user?.role === 'instructor' && (
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/instructor/dashboard"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Instructor Dashboard
                              </Link>
                            )}
                          </MenuItem>
                        )}
                        {user?.role === 'admin' && (
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/admin/dashboard"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Admin Dashboard
                              </Link>
                            )}
                          </MenuItem>
                        )}
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login" className="btn btn-primary">
                      Sign in
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <DisclosureButton
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Sign in
                  </DisclosureButton>
                  <DisclosureButton
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Sign up
                  </DisclosureButton>
                </div>
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
} 