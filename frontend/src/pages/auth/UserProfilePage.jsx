import { useSelector } from "react-redux";

export default function UserProfilePage() {
      const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <div className="text-center mt-20">Please log in to view your profile.</div>
    }
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="bg-white w-full max-w-3xl rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>
            <div className="flex items-center gap-4 mb-6">
            <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                <p><span className="font-medium">Full Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Course Stats</h3>
                <p><span className="font-medium">Enrolled Courses:</span> 5</p>
                <p><span className="font-medium">Certificates Earned:</span> 3</p>
            </div>
            </div>
            <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Profile</button>
            </div>
        </div>
        </div>
    );
}