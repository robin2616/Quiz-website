import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


function Profile() {
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <>
    <div className="divider"></div>
    <h2 className="text-2xl font-bold text-center">User Details</h2>
    <div className="bg-white p-4 rounded-lg shadow-md text-xl">
        <p><strong>Name :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Role :</strong> {user.isAdmin ? "Admin" : "User"}</p>
        <p><strong>Created At :</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At :</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
    </div>
    
    </>
  );
}

export default Profile;
