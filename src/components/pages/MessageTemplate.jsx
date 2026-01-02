import React, { useEffect, useState } from "react";
import Headers from "../main/Headers";
import Navs from "../main/Navs";
import { toast } from "react-toastify";

import {
  addTemplate,
  fetchTemplate,
  updateTemplate,
} from "../../apis/MessageTemplateService";

const MessageTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    message_title: "",
    message_description: "",
    message_image: "",
    website_link: "",
    call_number: "",
    whatsapp_number: "",
    whatsapp_message: "",
    message_status: "active",
  });

  useEffect(() => {
    getTemplates();
  }, []);

  const getTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetchTemplate();
      if (res.data.status) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTemplate(currentId, formData);
        toast.success("Template updated");
      } else {
        await addTemplate(formData);
        toast.success("Template added");
      }

      setModal(false);
      setIsEdit(false);
      setCurrentId(null);
      setFormData({
        message_title: "",
        message_description: "",
        message_image: "",
        website_link: "",
        call_number: "",
        whatsapp_number: "",
        whatsapp_message: "",
        message_status: "active",
      });

      getTemplates();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleEdit = (tpl) => {
    setIsEdit(true);
    setCurrentId(tpl._id);
    setFormData({
      message_title: tpl.message_title,
      message_description: tpl.message_description,
      message_image: tpl.message_image || "",
      website_link: tpl.website_link || "",
      call_number: tpl.call_number || "",
      whatsapp_number: tpl.whatsapp_number || "",
      whatsapp_message: tpl.whatsapp_message || "",
      message_status: tpl.message_status || "active",
    });
    setModal(true);
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
                <h2 className="fw-bold">Message Templates</h2>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setModal(true)}
                >
                  <i className="bi bi-plus-circle-dotted"></i>
                </button>
              </div>
            </div>

            {/* MESSAGE PREVIEW UI */}
            <div className="row">
              {templates.map((tpl) => (
                <div className="col-md-4 mb-3" key={tpl._id}>
                  <div className="card shadow-sm">
                    {tpl.message_image && (
                      <img
                        src={tpl.message_image}
                        alt="message template"
                        className="card-img-top"
                        style={{ height: 180, objectFit: "cover" }}
                      />
                    )}

                    <div className="card-body">
                      <h6 className="fw-bold">{tpl.message_title}</h6>
                      <p className="text-muted small">
                        {tpl.message_description}
                      </p>

                      <div className="d-flex gap-2 flex-wrap">
                        {tpl.website_link && (
                          <a
                            href={tpl.website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            🌐 Website
                          </a>
                        )}

                        {tpl.call_number && (
                          <a
                            href={`tel:${tpl.call_number}`}
                            className="btn btn-sm btn-success"
                          >
                            📞 Call
                          </a>
                        )}

                        {tpl.whatsapp_number && (
                          <a
                            href={`https://wa.me/91${tpl.whatsapp_number}?text=${encodeURIComponent(
                              tpl.whatsapp_message || ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                      </div>

                      <button
                        className="btn btn-sm btn-outline-warning mt-3"
                        onClick={() => handleEdit(tpl)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-backdrop-custom">
          <div className="modal-glass">
            <h5>{isEdit ? "Update Template" : "Add Template"}</h5>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                name="message_title"
                placeholder="Title"
                value={formData.message_title}
                onChange={handleChange}
                required
              />

              <textarea
                className="form-control mb-2"
                name="message_description"
                placeholder="Message"
                value={formData.message_description}
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-2"
                name="message_image"
                placeholder="Image URL"
                value={formData.message_image}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="website_link"
                placeholder="Website Link"
                value={formData.website_link}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="call_number"
                placeholder="Call Number"
                value={formData.call_number}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="whatsapp_number"
                placeholder="WhatsApp Number"
                value={formData.whatsapp_number}
                onChange={handleChange}
              />

              <textarea
                className="form-control mb-2"
                name="whatsapp_message"
                placeholder="WhatsApp Message"
                value={formData.whatsapp_message}
                onChange={handleChange}
              />

              <button className="btn btn-success w-100">
                {isEdit ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageTemplate;
