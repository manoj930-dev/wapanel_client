import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { fetchClientById } from "../../apis/ClientService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const View = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const response = await fetchClientById(id);
      if (response?.data?.status) {
        setData(response.data);
        toast.success("User Details Fetched Successfully");
      } else {
        toast.info(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const client = data?.client;
  const stats = data?.stats;
  const preview = data?.preview;

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

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
            {/* CLIENT DETAILS */}
            <div className="card glass mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Client Details</h4>
                <div className="row">
                  <div className="col-md-6">
                    <b>Name:</b> {client?.name}
                  </div>
                  <div className="col-md-6">
                    <b>Mobile:</b> {client?.mobile}
                  </div>
                  <div className="col-md-6">
                    <b>Email:</b> {client?.email}
                  </div>
                  <div className="col-md-6">
                    <b>Status:</b> {client?.status}
                  </div>
                  <div className="col-md-6">
                    <b>Tenant DB:</b> {client?.tenant_db}
                  </div>
                  <div className="col-md-6">
                    <b>Created:</b>{" "}
                    {client?.createdAt
                      ? new Date(client.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card glass text-center">
                  <div className="card-body">
                    <h6>Total Groups</h6>
                    <h2>{stats?.totalGroups ?? 0}</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card glass text-center">
                  <div className="card-body">
                    <h6>Total Contacts</h6>
                    <h2>{stats?.totalContacts ?? 0}</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card glass text-center">
                  <div className="card-body">
                    <h6>Total Templates</h6>
                    <h2>{stats?.totalTemplates ?? 0}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT GROUPS */}
            {/* RECENT GROUPS */}
            <div className="card glass mb-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Recent Groups</h5>

                {preview?.recentGroups?.length > 0 ? (
                  <ul className="list-group">
                    {preview.recentGroups.map((group) => (
                      <li key={group._id} className="list-group-item">
                        <div className="fw-bold">{group.group_name}</div>
                        <small className="text-muted">
                          {group.group_description || "No description"}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No groups found</p>
                )}
              </div>
            </div>

            {/* RECENT TEMPLATES */}
            <div className="card glass mb-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Recent Templates</h5>
                {preview?.recentTemplates?.length > 0 ? (
                  <ul className="list-group">
                    {preview.recentTemplates.map((tpl, index) => (
                      <li key={index} className="list-group-item">
                        {tpl.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No templates found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
