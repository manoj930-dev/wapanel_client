import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { fetchPlan, planById } from "../../apis/PlanService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const PlanView = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getPlan(id);
    }
  }, [id]);

  const getPlan = async (id) => {
    setLoading(true);
    try {
      const response = await planById(id);
      if (response?.data?.status) {
        setPlan(response.data.plan);
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
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
                <h2 className="fw-bold">User in plan</h2>
               
              </div>
            </div>

            <div className="card glass mb-3">
              <div className="card-body">
                {/* <pre>{JSON.stringify(plans, null, 2)}</pre> */}
                <h4 className="fw-bold mt-4">Total Users ({users.length})</h4>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Tenant DB</th>
                        <th>Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.client_name}</td>
                            <td>{user.client_mobile}</td>
                            <td>{user.client_email}</td>
                            <td>
                              <span className="badge bg-success">
                                {user.client_status}
                              </span>
                            </td>
                            <td>{user.tenant_db}</td>
                            <td>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No Users Found
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
    </>
  );
};

export default PlanView;
