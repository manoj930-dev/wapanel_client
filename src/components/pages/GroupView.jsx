import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { toast } from "react-toastify";
import {
  createGroup,
  deleteGroup,
  fetchGroupById,
  fetchGroups,
  numberAddInGroup,
  numberDeleteInGroup,
  numberUpdateInGroup,
  updateGroup,
} from "../../apis/GroupService";
import { useParams } from "react-router-dom";

const GroupView = () => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const { id } = useParams();
  const [modalAdd, setModalAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    status: "",
  });

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


  useEffect(() => {
    if (id) {
      getGroups(id);
    }
  }, [id]);

  /* ================= GET GROUPS ================= */
  const getGroups = async (id) => {
    setLoading(true);
    try {
      const res = await fetchGroupById(id);

      if (res.data.status) {
        setGroup(res.data.group); // single object
        setNumbers(res.data.numbers); // array
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNumber = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        group_id: id,
        name: formData.name,
        mobile: formData.mobile,
        status: formData.status,
      };

      const res = await numberAddInGroup(payload);

      if (res.data.status) {
        toast.success("Number added successfully");
        setModalAdd(false);
        setFormData({ name: "", mobile: "", status: "" });
        getGroups(id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (num) => {
    setIsEdit(true);
    setCurrentId(num._id);
    setFormData({
      name: num.name,
      mobile: num.mobile,
      status: num.status,
    });
    setModalAdd(true);
  };

  const handleUpdateNumber = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await numberUpdateInGroup(currentId, formData);

      if (res.data.status) {
        toast.success("Number updated successfully");
        setModalAdd(false);
        setIsEdit(false);
        setFormData({ name: "", mobile: "", status: "" });
        getGroups(id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };
const confirmDelete = async (numId) => {
  try {
    const res = await numberDeleteInGroup(numId);

    if (res.data.status) {
      toast.success("Number deleted successfully");
      getGroups(id);
    } else {
      toast.error(res.data.message || "Delete failed");
    }
  } catch (err) {
    toast.error("Delete failed");
  }
};


 const handleDelete = (numId) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Are you sure you want to delete?</p>
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-secondary"
            onClick={closeToast}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              closeToast();
              await confirmDelete(numId);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
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
            {group && (
              <div className="card glass mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="">
                      <h3 className="fw-bold mb-1">{group.group_name}</h3>
                      <p className="text-muted mb-0">
                        {group.group_description}
                      </p>
                      <span className="badge bg-primary mt-2">
                        Total Numbers: {numbers.length}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setIsEdit(false);
                        setFormData({ name: "", mobile: "" });
                        setModalAdd(true);
                      }}
                    >
                      <i className="bi bi-plus-circle-dotted"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="card glass">
              <div className="card-body table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numbers.length > 0 ? (
                      numbers.map((num, i) => (
                        <tr key={num._id}>
                          <td>{i + 1}</td>
                          <td>{num.name}</td>
                          <td>{num.mobile}</td>
                          <td>
                            <span className={`badge ${num.status === "active" ? 'bg-primary' : 'bg-danger'}`}>
                              {num.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEditOpen(num)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(num._id)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Numbers Found
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

      {modalAdd && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setModalAdd(false)}
        >
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            <h4 className="fw-bold mb-3">
              {isEdit ? "Update Number" : "Add Number"}
            </h4>

            <form onSubmit={isEdit ? handleUpdateNumber : handleAddNumber}>
              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="mobile"
                className="form-control mb-2"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <select
                name="status"
                className="form-control mb-2"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

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

export default GroupView;
