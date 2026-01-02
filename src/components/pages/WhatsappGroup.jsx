import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import {
  downloadGroupParticipants,
  getGroups,
  sendGroupMessage,
} from "../../apis/WhatsappService";
import axios from "axios";
import { toast } from "react-toastify";

const WhatsappGroup = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("wa_token");
  const [totalGroups, setTotalGroups] = useState("");

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const response = await getGroups(token);
      if (response?.data?.groups) {
        setGroups(response.data.groups);
        setTotalGroups(response.data.total || response.data.groups.length);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch groups");
    }
  };

  // Send message to group
  const handleSendMessage = async () => {
    if (!selectedGroup || !message) {
      return toast.error("Select a group and type a message");
    }

    try {
      await sendGroupMessage({ token, groupId: selectedGroup, message });
      toast.success("Message sent successfully!");
      setMessage("");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send message");
    }
  };

  // Download CSV of participants
  const downloadParticipants = async (groupId, groupName) => {
    try {
      const token = localStorage.getItem("wa_token");
      if (!token) return toast.error("WhatsApp session not active");

      const response = await downloadGroupParticipants(token, groupId);

      // Create a temporary link to download CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `group_${groupName || groupId}_participants.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Participants for "${groupName || groupId}" downloaded`);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error || "Failed to download participants"
      );
    }
  };

  useEffect(() => {
    if (token) fetchGroups();
  }, [token]);

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
                <h2 className="fw-bold">
                  Whatsapp Groups Total : {totalGroups}
                </h2>
              </div>
            </div>

            {/* Message Section */}
            <div className="card glass mb-3 p-3">
              <h5>Select Group</h5>
              <select
                className="form-select mb-3"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">-- Select a group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name || g.id} ({g.participants})
                  </option>
                ))}
              </select>

              <h5>Message</h5>
              <textarea
                className="form-control mb-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />

              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>

            {/* Groups Cards */}
            <div className="row">
              {groups.map((group) => (
                <div key={group.id} className="col-md-4 mb-3">
                  <div className="card glass h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">
                        {group.name || "Unnamed Group"}
                      </h5>
                      <p className="card-text">
                        Participants: {group.participants}
                      </p>
                      <button
                        className="btn btn-success mt-auto"
                        onClick={() =>
                          downloadParticipants(group.id, group.name || group.id)
                        }
                      >
                        Export Participants
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {groups.length === 0 && (
                <div className="col-12">
                  <p>No groups found.</p>
                </div>
              )}
            </div>

            {/* Debug JSON */}
            <div className="card glass mb-3 mt-3">
              {/* <div className="card-body">
                <h5>Groups JSON (Debug)</h5>
                <pre>{JSON.stringify(groups, null, 2)}</pre>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsappGroup;
