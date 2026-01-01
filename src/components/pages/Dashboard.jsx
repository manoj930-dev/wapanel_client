import React from "react";
import Navs from "../main/Navs";
import Headers from "../main/Headers";

const Dashboard = () => {
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

            {/* PAGE TITLE */}
            <div className="card glass mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h2 className="fw-bold">Dashboard</h2>
                <span className="text-muted">
                  {new Date().toDateString()}
                </span>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="row g-3">
              {[
                { title: "Total Users", value: 120 },
                { title: "Active Clients", value: 85 },
                { title: "Plans", value: 6 },
                { title: "Revenue", value: "₹1,25,000" },
              ].map((item, i) => (
                <div key={i} className="col-sm-6 col-lg-3">
                  <div className="card glass stat-card">
                    <div className="card-body">
                      <h6 className="text-muted">{item.title}</h6>
                      <h3 className="fw-bold text-primary">
                        {item.value}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CALENDAR + IMPORTANT TASKS */}
            <div className="row mt-4 g-3">

              {/* CALENDAR */}
              <div className="col-lg-6">
                <div className="card glass h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">📅 Calendar</h5>
                    <input
                      type="date"
                      className="form-control"
                    />
                    <ul className="list-group list-group-flush mt-3">
                      <li className="list-group-item">
                        🔔 Client Renewal - Monu Pvt
                      </li>
                      <li className="list-group-item">
                        📞 Follow-up with Sonu Pvt Ltd
                      </li>
                      <li className="list-group-item">
                        🧾 Invoice Generation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* IMPORTANT ALERTS */}
              <div className="col-lg-6">
                <div className="card glass h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">⚠️ Important Alerts</h5>

                    <div className="alert alert-warning">
                      3 Clients plan expiring this week
                    </div>

                    <div className="alert alert-danger">
                      2 Payments pending
                    </div>

                    <div className="alert alert-info">
                      New version update available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY + QUICK ACTIONS */}
            <div className="row mt-4 g-3">

              {/* RECENT ACTIVITY */}
              <div className="col-lg-6">
                <div className="card glass h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">🕒 Recent Activity</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        ✔ New client "Vinu" added
                      </li>
                      <li className="list-group-item">
                        💳 Payment received from Monu Pvt
                      </li>
                      <li className="list-group-item">
                        📦 New plan purchased
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="col-lg-6">
                <div className="card glass h-100">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">⚡ Quick Actions</h5>

                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-primary">
                        ➕ Add Client
                      </button>
                      <button className="btn btn-success">
                        📦 Create Plan
                      </button>
                      <button className="btn btn-warning">
                        📊 View Reports
                      </button>
                      <button className="btn btn-dark">
                        ⚙️ Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
