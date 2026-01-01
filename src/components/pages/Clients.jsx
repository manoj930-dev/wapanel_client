import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import {
  createClient,
  fetchClient,
  updateClient,
} from "../../apis/ClientService";
import { toast } from "react-toastify";
import { fetchPlan } from "../../apis/PlanService";
import { Link } from "react-router-dom";

const Clients = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [plans, setPlans] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  
  const [formData, setFormData] = useState({
    client_name: "",
    client_mobile: "",
    client_email: "",
    client_plan: "",
    client_address: "",
    client_status: "active",
    client_pin: "",
  });

  //   clients fetch

  const getClients = async () => {
    setLoading(true);
    try {
      const response = await fetchClient();
      if (response.data.status) {
        setData(response?.data?.data);
        toast.success("Clients fetch successfully ");
      } else {
        toast.info(response?.data?.message);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getClients();
  }, []);

  // plan fetched

  const getPlan = async () => {
    setLoading(true);
    try {
      const response = await fetchPlan();
      if (response?.data?.status) {
        setPlans(response?.data?.plans);
        toast.success("Plan fetched successfully");
      } else {
        toast.info(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  //   client add

  const clientAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createClient(formData);
      if (response?.data?.status) {
        toast.success("Client created successfully");
        setModalAdd(false);
        getClients(); // refresh list
      } else {
        toast.info(response?.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // update clients
  const handleEdit = (client) => {
    setIsEdit(true);
    setEditId(client._id);

    setFormData({
      client_name: client.client_name,
      client_mobile: client.client_mobile,
      client_email: client.client_email,
      client_plan: client.client_plan?._id,
      client_address: client.client_address,
      client_status: client.client_status,
      client_pin: client.client_pin,
    });

    setModalAdd(true);
  };

  const clientUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateClient(editId, formData);

      if (response?.data?.status) {
        toast.success("Client updated successfully");
        setModalAdd(false);
        setIsEdit(false);
        setEditId(null);
        getClients();
      } else {
        toast.info(response?.data?.message);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  //modal controll

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setModalAdd(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) return <p>Loading...</p>;
  
  return (
    <>

      <Navs />
      <div className="container-fluid dashboard-layout">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-2 p-0 sidebar-wrapper">
            <Headers />
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-10 px-4 main-content">
            <div className="card glass mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h2 className="fw-bold">Clients</h2>
                <div className="d-flex">
                 
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      setEditId(null);
                      setFormData({
                        client_name: "",
                        client_mobile: "",
                        client_email: "",
                        client_plan: "",
                        client_address: "",
                        client_status: "active",
                        client_pin: "",
                      });
                      setModalAdd(true);
                    }}
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-plus-circle-dotted"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="card glass mb-3">
              <div className="card-body">
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                <div className="table-responsive">
                  <table className="table bg-primary">
                    <thead className="bg-primary">
                      <tr>
                        <th>Sr.no</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Plan</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.length > 0 ? (
                        data.map((client, i) => (
                          <tr key={client._id}>
                            <td>{i + 1}</td>
                            <td>{client.client_name}</td>

                            <td>
                              <span
                                className={`badge ${
                                  client.client_status === "active"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {client.client_status}
                              </span>
                            </td>

                            <td>{client.client_mobile}</td>

                            <td>{client.client_email}</td>

                            <td>
                              {client.client_plan?.plan_name} <br />
                              <small className="text-muted">
                                ₹{client.client_plan?.plan_price}
                              </small>
                            </td>

                            <td>
                              <Link to={`/view/${client._id}`}>
                                <button className="btn btn-sm btn-outline-success me-2">
                                  <i className="bi bi-eye-fill"></i>
                                </button>
                              </Link>

                              <button
                                onClick={() => handleEdit(client)}
                                className="btn btn-sm btn-outline-warning me-2"
                              >
                                <i class="bi bi-pencil-fill"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash3-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Clients Found
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
      </div>

      {modalAdd && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setModalAdd(false)}
        >
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                {isEdit ? "Update Client" : "Add Client"}
              </h4>

              <button
                className="btn-close btn-close-white"
                onClick={() => setModalAdd(false)}
              ></button>
            </div>

            {/* BODY */}
            <form onSubmit={isEdit ? clientUpdate : clientAdd}>
              <input
                type="text"
                name="client_name"
                placeholder="Client Name"
                className="form-control mb-2"
                value={formData.client_name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="client_mobile"
                placeholder="Mobile"
                className="form-control mb-2"
                value={formData.client_mobile}
                onChange={handleChange}
              />

              <input
                type="email"
                name="client_email"
                placeholder="Email"
                className="form-control mb-2"
                value={formData.client_email}
                onChange={handleChange}
              />

              <select
                name="client_plan"
                className="form-control mb-2"
                value={formData.client_plan}
                onChange={handleChange}
              >
                <option value="">Select Plan</option>
                {plans?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.plan_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="client_address"
                placeholder="Address"
                className="form-control mb-2"
                value={formData.client_address}
                onChange={handleChange}
              />

              <select
                name="client_status"
                className="form-control mb-2"
                value={formData.client_status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <input
                type="text"
                name="client_pin"
                placeholder="Pin"
                className="form-control mb-2"
                value={formData.client_pin}
                onChange={handleChange}
              />

              {/* FOOTER */}
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

export default Clients;
