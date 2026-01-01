import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { createPlan, fetchPlan, UpdatePlan } from "../../apis/PlanService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Plans = () => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [formData, setFormData] = useState({
    plan_name: "",
    plan_price: "",
    plan_duration: "",
    plan_description: "",
    plan_status: "active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const planAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createPlan(formData);
      if (response?.data?.status) {
        toast.success("Plan added successfully");
        setModalAdd(false);
        getPlan();
        resetForm();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const planUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await UpdatePlan(selectedPlanId, formData);
      if (response?.data?.status) {
        toast.success("Plan updated successfully");
        setModalAdd(false);
        getPlan();
        resetForm();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setIsEdit(true);
    setSelectedPlanId(plan._id);
    setFormData({
      plan_name: plan.plan_name,
      plan_price: plan.plan_price,
      plan_duration: plan.plan_duration,
      plan_description: plan.plan_description,
      plan_status: plan.plan_status,
    });
    setModalAdd(true);
  };

  const resetForm = () => {
    setFormData({
      plan_name: "",
      plan_price: "",
      plan_duration: "",
      plan_description: "",
      plan_status: "active",
    });
    setIsEdit(false);
    setSelectedPlanId(null);
  };
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
                <h2 className="fw-bold">Plans</h2>
                <div className="d-flex">
                
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      resetForm();
                      setIsEdit(false);
                      setModalAdd(true);
                    }}
                  >
                    <i className="bi bi-plus-circle-dotted"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="card glass mb-3">
              <div className="card-body">
                {/* <pre>{JSON.stringify(plans, null, 2)}</pre> */}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Plan Name</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {plans.length > 0 ? (
                        plans.map((plan, index) => (
                          <tr key={plan._id}>
                            <td>{index + 1}</td>
                            <td>{plan.plan_name}</td>
                            <td>₹{plan.plan_price}</td>
                            <td>{plan.plan_duration}</td>
                            <td>{plan.plan_description}</td>
                            <td>
                              <span
                                className={`badge ${
                                  plan.plan_status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {plan.plan_status}
                              </span>
                            </td>
                            <td>
                              <Link to={`/plan/view/${plan._id}`}>
                                <button className="btn btn-sm btn-outline-success me-2">
                                  <i className="bi bi-eye-fill"></i>
                                </button>
                              </Link>

                              <button
                                className="btn btn-sm btn-outline-warning me-2"
                                onClick={() => handleEdit(plan)}
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>

                              <button className="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash3-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No Plans Found
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
                {isEdit ? "Update Plan" : "Add Plan"}
              </h4>
              <button
                className="btn-close btn-close-white"
                onClick={() => setModalAdd(false)}
              ></button>
            </div>

            {/* BODY */}
            <form onSubmit={isEdit ? planUpdate : planAdd}>
              <input
                type="text"
                name="plan_name"
                placeholder="Plan Name"
                className="form-control mb-2"
                value={formData.plan_name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="plan_price"
                placeholder="Price"
                className="form-control mb-2"
                value={formData.plan_price}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="plan_duration"
                placeholder="Duration (e.g. 1 year)"
                className="form-control mb-2"
                value={formData.plan_duration}
                onChange={handleChange}
              />

              <textarea
                name="plan_description"
                placeholder="Description"
                className="form-control mb-2"
                value={formData.plan_description}
                onChange={handleChange}
              />

              <select
                name="plan_status"
                className="form-control mb-2"
                value={formData.plan_status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

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

export default Plans;
