import React, { useMemo, useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import "./AdmManageUser.css";

function AdmManageUser() {
  const [users, setUsers] = useState([]);
  const userId = "currentUserId"; // Replace with the actual current user's ID.

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const usersData = userDocs.docs.map((doc) => {
          const data = doc.data();
          const lastActive = data.last_active?.toDate();
          const isOnline = lastActive
            ? (new Date() - lastActive) / (1000 * 60) < 10 // Online if last active within 10 minutes
            : false;

          return {
            id: doc.id,
            ...data,
            is_online: isOnline,
            created_at: data.created_at?.toDate().toLocaleDateString("en-US"),
          };
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "profile_picture",
        header: "Profile",
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        size: 80,
        Cell: ({ cell }) => (
          <img
            src={cell.getValue()}
            alt="Profile"
            className="profile-image2"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ),
      },
      { accessorKey: "first_name", header: "First Name", size: 120 },
      { accessorKey: "last_name", header: "Last Name", size: 120 },
      { accessorKey: "email", header: "Email", size: 180 },
      { accessorKey: "user_type", header: "User Type", size: 100 },
      {
        accessorKey: "created_at",
        header: "Date Joined",
        size: 120,
      },
      {
        accessorKey: "is_online",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => (
          <span
            className={`status-indicator ${
              cell.getValue() ? "status-active" : "status-inactive"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        accessorKey: "actions",
        header: "Action",
        size: 200,
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="archive-button"
              onClick={() => handleArchive(row.original.id)}
            >
              Archive
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleArchive = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { is_online: false });
      console.log(`User with ID ${userId} archived`);
    } catch (error) {
      console.error("Error archiving user:", error);
    }
  };

  // Update last active timestamp on user interaction
  /*
  const updateLastActive = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        last_active: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating last active:", error);
    }
  };

  // Call updateLastActive on various interactions
  useEffect(() => {
    const interval = setInterval(updateLastActive, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  */

  return (
    <div className="user-management-container">
      <h2>Manage Users</h2>
      <p>Here you can view or archive user accounts.</p>
      <MaterialReactTable
        columns={columns}
        data={users}
        enableFullScreenToggle
        enableDensityToggle
        enableColumnActions
        enableColumnFilters
        enablePagination={true}
        enableGlobalFilter
        globalFilterFn="contains"
      />
    </div>
  );
}

export default AdmManageUser;
