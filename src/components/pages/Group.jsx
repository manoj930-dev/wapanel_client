import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { toast } from "react-toastify";
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  updateGroup,
} from "../../apis/GroupService";
import { Link } from "react-router-dom";

const Group = () => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [formData, setFormData] = useState({
    group_name: "",
    group_description: "",
  });

  /* ================= GET GROUPS ================= */
  const getGroups = async () => {
    setLoading(true);
    try {
      const res = await fetchGroups();
      if (res.data.status) {
        setGroups(res.data.groups);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ group_name: "", group_description: "" });
    setIsEdit(false);
    setSelectedGroupId(null);
  };

  /* ================= CREATE ================= */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createGroup(formData);
      if (res.data.status) {
        toast.success("Group created successfully");
        setModalAdd(false);
        getGroups();
        resetForm();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (group) => {
    setIsEdit(true);
    setSelectedGroupId(group._id);
    setFormData({
      group_name: group.group_name,
      group_description: group.group_description,
    });
    setModalAdd(true);
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateGroup(selectedGroupId, formData);
      if (res.data.status) {
        toast.success("Group updated successfully");
        setModalAdd(false);
        getGroups();
        resetForm();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await deleteGroup(id);
      if (res.data.status) {
        toast.success("Group deleted");
        getGroups();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navs />
      <div className="container-fluid dashboard-layout">
        <div className="row">
          <div className="col-md-2 p-0 sidebar-wrapper">
            <Headers />
          </div>

          <div className="col-md-10 px-4 main-content">
            <div className="card glass mb-3">
              <div className="card-body d-flex justify-content-between">
                <h2 className="fw-bold">Groups</h2>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    resetForm();
                    setModalAdd(true);
                  }}
                >
                  <i className="bi bi-plus-circle-dotted"></i>
                </button>
              </div>
            </div>

            <div className="card glass">
              <div className="card-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Group Name</th>
                      <th>Description</th>
                      <th>Total Numbers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.length > 0 ? (
                      groups.map((group, i) => (
                        <tr key={group._id}>
                          <td>{i + 1}</td>
                          <td>{group.group_name}</td>
                          <td>{group.group_description}</td>
                          <td>{group.totalNumbers || 0}</td>
                          <td>
                             <Link to={`/groups/view/${group._id}`}>
                                <button className="btn btn-sm btn-outline-success me-2">
                                  <i className="bi bi-eye-fill"></i>
                                </button>
                              </Link>
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEdit(group)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(group._id)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Groups Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {modalAdd && (
        <div className="modal-backdrop-custom" onClick={() => setModalAdd(false)}>
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            <h4 className="fw-bold mb-3">
              {isEdit ? "Update Group" : "Add Group"}
            </h4>

            <form onSubmit={isEdit ? handleUpdate : handleCreate}>
              <input
                type="text"
                name="group_name"
                className="form-control mb-2"
                placeholder="Group Name"
                value={formData.group_name}
                onChange={handleChange}
                required
              />

              <textarea
                name="group_description"
                className="form-control mb-2"
                placeholder="Description"
                value={formData.group_description}
                onChange={handleChange}
              />

              <div className="text-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setModalAdd(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Group;
