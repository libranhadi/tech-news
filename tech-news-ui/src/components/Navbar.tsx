import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants/NavLink';

export default function Navbar() {
  return (
    <nav className="bg-orange-500 dark:bg-gray-800  text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
            <Link to="/" className="font-bold mr-2 hover:text-gray-200">
                Hacker News
            </Link>
            {NAV_LINKS.map((link) => (
                <Link
                key={link.path}
                to={link.path}
                className="text-sm p-1"
                >
                {link.label} 
                </Link>
            ))}
        </div>
        {/* <div>
            <div className="flex items-center text-xs space-x-4">
                <Link
                    to="/login"
                    className="hover:underline hover:text-gray-200"
                >
                    User
                </Link>
                <Link
                    to="/login"
                    className="hover:underline hover:text-gray-200"
                >
                    Login
                </Link>
            </div>
        </div> */}
      </div>
    </nav>
  );
}