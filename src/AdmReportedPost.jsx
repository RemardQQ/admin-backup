import React, { useMemo, useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./AdmReportedPost.css";

function AdmReportedPost() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({}); // To track which dropdowns are open

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const reportedPostsCollection = collection(db, "ReportedArtwork");
        const reportedPostsDocs = await getDocs(reportedPostsCollection);
        const reportedPostsData = reportedPostsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReportedPosts(reportedPostsData);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      }
    };

    fetchReportedPosts();
  }, []);

  // Archive a post by updating its status
  const handleArchivePost = async (postId) => {
    try {
      const postDocRef = doc(db, "ReportedArtwork", postId);
      await updateDoc(postDocRef, {
        status: "archived", // Mark the post as archived
      });

      // Update the UI to reflect the archived status
      setReportedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: "archived" } : post
        )
      );
    } catch (error) {
      console.error("Error archiving post:", error);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (postId) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "reportedArtworkId",
        header: "Artwork ID",
        size: 120,
      },
      {
        accessorKey: "reporterUserId",
        header: "Reporter User ID",
        size: 120,
      },
      {
        accessorKey: "reportedUserId",
        header: "Reported User ID",
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 90,
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{row.original.status}</span>
            {row.original.status === "plagiarism_detected" && (
              <>
                <button
                  className="plagiarism-dropdown-btn"
                  onClick={() => toggleDropdown(row.original.id)}
                >
                  ▼
                </button>
                {dropdownOpen[row.original.id] && (
                  <div className="dropdown-content">
                    <p>
                      <strong>Detected Plagiarism: </strong>
                      <a
                        href={row.original.detectedPlagiarism}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Plagiarism Report
                      </a>
                    </p>
                    <p>
                      <strong>Evidence: </strong>
                      <a
                        href={row.original.evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Evidence
                      </a>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        size: 150,
        Cell: ({ cell }) =>
          new Date(cell.getValue().seconds * 1000).toLocaleString(),
      },
      {
        accessorKey: "actions",
        header: "Action",
        size: 160,
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="archive-post-btn"
              onClick={() => handleArchivePost(row.original.id)}
            >
              Archive
            </button>
          </div>
        ),
      },
    ],
    [dropdownOpen]
  );

  return (
    <div className="reported-posts-container">
      <h2>Manage Reported Posts</h2>
      <p>Here you can view or archive reported posts.</p>
      <MaterialReactTable
        columns={columns}
        data={reportedPosts}
        enableFullScreenToggle={true}
        enableDensityToggle
        enableColumnActions
        enableColumnFilters
        enablePagination={true}
        enableGlobalFilter
        globalFilterFn="contains"
        initialState={{ pagination: { pageSize: 10 } }}
      />
    </div>
  );
}

export default AdmReportedPost;
