import { useEffect, useRef, useState } from "react";
import {
  getProfile,
  getQR,
  logoutSession,
  sendBulkMessage,
  sessionCreate,
} from "../../apis/WhatsappService";
import Navs from "../main/Navs";
import Headers from "../main/Headers";
import { fetchGroupById, fetchGroups } from "../../apis/GroupService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Whatsapp = () => {
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState("");
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("");
  const [qr, setQr] = useState(null);
  const [group, setGroup] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const qrIntervalRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup]=useState('');

  const getGroup = async () => {
    setLoading(true);
    try {
      const res = await fetchGroups();
      if (res.data.status) {
        setGroups(res?.data?.groups);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

  const getGroups = async (selectedGroup) => {
    setLoading(true);
    try {
      const res = await fetchGroupById(selectedGroup);

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

  useEffect(() => {
    if (selectedGroup) {
      getGroups(selectedGroup);
    }
  }, [selectedGroup]);

  /* =========================
      CREATE SESSION
  ========================= */
  const handleSessionCreate = async () => {
    try {
      setError("");
      const res = await sessionCreate({ identifier, pin });

      // ✅ SAVE IN STATE
      setToken(res.data.token);
      setStatus(res.data.status);
      setStep(2);

      // ✅ SAVE IN LOCALSTORAGE
      localStorage.setItem("wa_token", res.data.token);
      localStorage.setItem("wa_step", "2");

      startQRPolling(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Session failed");
    }
  };

  /* =========================
      QR POLLING
  ========================= */
  const startQRPolling = (token) => {
    qrIntervalRef.current = setInterval(async () => {
      try {
        const res = await getQR(token);

        setStatus(res.data.status);
        setQr(res.data.qr);

        if (res.data.status === "READY") {
          clearInterval(qrIntervalRef.current);
          setStep(3);
          localStorage.setItem("wa_step", "3");
          loadProfile(token);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  /* =========================
      PROFILE LOAD
  ========================= */
  const loadProfile = async (token) => {
    try {
      await getProfile(token);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
      BULK MESSAGE
  ========================= */
  const handleBulkMessage = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("token", token);

    await sendBulkMessage(formData);
    alert("✅ Campaign Launched");
  };

  /* =========================
      LOGOUT
  ========================= */
  const handleLogout = async () => {
    await logoutSession(token);

    localStorage.removeItem("wa_token");
    localStorage.removeItem("wa_step");

    window.location.reload();
  };

  /* =========================
      CLEANUP
  ========================= */
  useEffect(() => {
    return () => {
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("wa_token");
    const savedStep = localStorage.getItem("wa_step");

    if (!savedToken) {
      setStep(1);
      return;
    }

    // 🔥 backend ko ping karo
    getProfile(savedToken)
      .then(() => {
        setToken(savedToken);
        setStep(Number(savedStep || 3));
      })
      .catch(() => {
        // backend bola: session dead
        localStorage.removeItem("wa_token");
        localStorage.removeItem("wa_step");
        setStep(1);
      });
  }, []);

  return (
    <>
      <Navs />

      <div className="container-fluid dashboard-layout">
        <div className="row">
          <div className="col-md-2 p-0 sidebar-wrapper">
            <Headers />
          </div>

          <div className="col-md-10 px-4 main-content">
            {step === 1 && (
              <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                  <div className="glass p-5 text-center">
                    <h3 className="fw-bold mb-4">Welcome Back</h3>

                    <input
                      className="form-control mb-3"
                      placeholder="Mobile Number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button
                      className="btn btn-success w-100"
                      onClick={handleSessionCreate}
                    >
                      Initialize Session
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="row justify-content-center mt-5">
                <div className="col-md-5 text-center">
                  <div className="glass p-4">
                    <h5>Scan QR Code</h5>

                    {qr && (
                      <img
                        src={qr}
                        alt="QR"
                        style={{ width: 200, height: 200 }}
                      />
                    )}

                    <p className="text-warning mt-3">
                      Waiting for WhatsApp scan...
                    </p>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="glass p-4 mt-4">
                <div className="d-flex justify-content-between mb-3">
                  <h4>Bulk Messaging</h4>
                  {/* <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button> */}
                </div>

                <select className="form-select mb-2" name="groups" value={selectedGroup} onChange={(e)=> setSelectedGroup(e.target.value)}>
                  <option value="">--Select Groups -- </option>
                  {groups.map((item, i) => (
                    <option key={item.id} value={item._id}>
                      {item.group_name}
                    </option>
                  ))}
                </select>

                <form onSubmit={handleBulkMessage}>
                  <textarea
                    name="numbers"
                    className="form-control mb-3"
                    placeholder="Numbers"
                    rows="3"
                    required
                  />

                  <textarea
                    name="message"
                    className="form-control mb-3"
                    placeholder="Message"
                    rows="4"
                  />

                  <input
                    type="file"
                    name="image"
                    className="form-control mb-3"
                  />

                  <input
                    type="number"
                    name="interval"
                    className="form-control mb-3"
                    placeholder="Delay (ms)"
                  />

                  <button className="btn btn-success w-100">
                    🚀 Launch Campaign
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Whatsapp;

// import { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   getProfile,
//   getQR,
//   logoutSession,
//   sendBulkMessage,
//   sessionCreate,
// } from "../../apis/WhatsappService";
// import Navs from "../main/Navs";
// import Headers from "../main/Headers";
// import * as XLSX from "xlsx";

// const Whatsapp = () => {
//   const [identifier, setIdentifier] = useState("");
//   const [pin, setPin] = useState("");
//   const [token, setToken] = useState(null);
//   const [status, setStatus] = useState("");
//   const [qr, setQr] = useState(null);
//   const [step, setStep] = useState(1);
//   const [error, setError] = useState("");
//   const [numbers, setNumbers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [interval, setIntervalVal] = useState("");

//   const cleanNumber = (value) => {
//     if (!value) return null;

//     let num = String(value).replace(/\D/g, ""); // only digits

//     // remove country code
//     if (num.startsWith("91") && num.length > 10) {
//       num = num.slice(-10);
//     }

//     // remove leading 0
//     if (num.startsWith("0") && num.length > 10) {
//       num = num.slice(-10);
//     }

//     // final validation
//     if (num.length === 10) return num;

//     return null;
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const data = new Uint8Array(evt.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       let extracted = [];

//       workbook.SheetNames.forEach((sheet) => {
//         const ws = workbook.Sheets[sheet];
//         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

//         rows.forEach((row) => {
//           row.forEach((cell) => {
//             const cleaned = cleanNumber(cell);
//             if (cleaned) extracted.push(cleaned);
//           });
//         });
//       });

//       const unique = [...new Set(extracted)];
//       setNumbers(unique);

//       toast.success(
//         `📊 Extracted ${extracted.length}, Unique ${unique.length}`
//       );
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const clearAll = () => {
//     setNumbers([]);
//     setMessage("");
//     setIntervalVal("");
//   };

//   const copyNumbers = () => {
//     if (!numbers.length) return toast.error("No numbers to copy");
//     navigator.clipboard.writeText(numbers.join("\n"));
//     toast.success("📋 Numbers copied");
//   };

//   const sendCampaign = async () => {
//     if (!numbers.length) return toast.error("No numbers");
//     if (numbers.length > 300)
//       return toast.error("⚠️ Max 300 numbers allowed per campaign");
//     if (!message) return toast.error("Message required");

//     const formData = new FormData();
//     formData.append("numbers", numbers.join("\n"));
//     formData.append("message", message);
//     formData.append("interval", interval || 2000);
//     formData.append("token", token);

//     try {
//       await sendBulkMessage(formData);
//       toast.success("🚀 Campaign Launched");
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Send failed");
//     }
//   };

//   const qrIntervalRef = useRef(null);

//   /* =========================
//       CREATE SESSION
//   ========================= */
//   const handleSessionCreate = async () => {
//     try {
//       setError("");
//       const res = await sessionCreate({ identifier, pin });

//       setToken(res.data.token);
//       setStatus(res.data.status);
//       setStep(2);

//       localStorage.setItem("wa_token", res.data.token);
//       localStorage.setItem("wa_step", "2");

//       startQRPolling(res.data.token);
//     } catch (err) {
//       const msg = err.response?.data?.error || "Session failed";
//       setError(msg);
//       toast.error(msg);
//     }
//   };

//   /* =========================
//       QR POLLING
//   ========================= */
//   const startQRPolling = (token) => {
//     qrIntervalRef.current = setInterval(async () => {
//       try {
//         const res = await getQR(token);
//         setStatus(res.data.status);
//         setQr(res.data.qr);

//         if (res.data.status === "READY") {
//           clearInterval(qrIntervalRef.current);
//           setStep(3);
//           localStorage.setItem("wa_step", "3");
//           loadProfile(token);
//           toast.success("✅ WhatsApp is ready!");
//         }

//         if (res.data.status === "FAILED") {
//           clearInterval(qrIntervalRef.current);
//           toast.error("❌ Session failed. Logging out...");
//           handleLogout();
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error(err?.response?.data?.error || "QR fetch error");
//       }
//     }, 2000);
//   };

//   /* =========================
//       PROFILE LOAD
//   ========================= */
//   const loadProfile = async (token) => {
//     try {
//       await getProfile(token);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.error || "Profile load failed");
//     }
//   };

//   /* =========================
//       BULK MESSAGE
//   ========================= */
//   const handleBulkMessage = async (e) => {
//     e.preventDefault();
//     if (!token) return toast.error("Session not active!");

//     const formData = new FormData(e.target);
//     formData.append("token", token);

//     try {
//       const res = await sendBulkMessage(formData);
//       toast.success("✅ Campaign Launched");
//       console.log("Bulk message response:", res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.error || "Failed to send bulk message");
//     }
//   };

//   /* =========================
//       LOGOUT
//   ========================= */
//   const handleLogout = async () => {
//     try {
//       if (token) await logoutSession(token);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       localStorage.removeItem("wa_token");
//       localStorage.removeItem("wa_step");
//       setToken(null);
//       setStep(1);
//       setQr(null);
//       setStatus("");
//       toast.info("Logged out successfully");
//     }
//   };

//   /* =========================
//       CLEANUP
//   ========================= */
//   useEffect(() => {
//     return () => {
//       if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
//     };
//   }, []);

//   /* =========================
//       CHECK SAVED SESSION
//   ========================= */
//   useEffect(() => {
//     const savedToken = localStorage.getItem("wa_token");
//     const savedStep = localStorage.getItem("wa_step");

//     if (!savedToken) {
//       setStep(1);
//       return;
//     }

//     getProfile(savedToken)
//       .then(() => {
//         setToken(savedToken);
//         setStep(Number(savedStep || 3));
//         toast.success("✅ Session restored");
//       })
//       .catch(() => {
//         toast.error("❌ Session expired. Please login again.");
//         localStorage.removeItem("wa_token");
//         localStorage.removeItem("wa_step");
//         setStep(1);
//       });
//   }, []);

//   return (
//     <>
//       <Navs />
//       <div className="container-fluid dashboard-layout">
//         <div className="row">
//           <div className="col-md-2 p-0 sidebar-wrapper">
//             <Headers />
//           </div>

//           <div className="col-md-10 px-4 main-content">
//             {step === 1 && (
//               <div className="row justify-content-center mt-5">
//                 <div className="col-md-5">
//                   <div className="glass p-5 text-center">
//                     <h3 className="fw-bold mb-4">Welcome Back</h3>

//                     <input
//                       className="form-control mb-3"
//                       placeholder="Mobile Number"
//                       value={identifier}
//                       onChange={(e) => setIdentifier(e.target.value)}
//                     />

//                     <input
//                       type="password"
//                       className="form-control mb-3"
//                       placeholder="PIN"
//                       value={pin}
//                       onChange={(e) => setPin(e.target.value)}
//                     />

//                     {error && <div className="alert alert-danger">{error}</div>}

//                     <button
//                       className="btn btn-success w-100"
//                       onClick={handleSessionCreate}
//                     >
//                       Initialize Session
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="row justify-content-center mt-5">
//                 <div className="col-md-5 text-center">
//                   <div className="glass p-4">
//                     <h5>Scan QR Code</h5>
//                     {qr && (
//                       <img
//                         src={qr}
//                         alt="QR"
//                         style={{ width: 200, height: 200 }}
//                       />
//                     )}
//                     <p className="text-warning mt-3">
//                       Waiting for WhatsApp scan...
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <>
//                 <div className="row g-4 mt-4">
//                   {/* Upload */}
//                   <div className="col-lg-5">
//                     <div className="glass p-4">
//                       <h5>Step 1: Upload File</h5>

//                       <div
//                         className="upload-box"
//                         onClick={() =>
//                           document.getElementById("fileInput").click()
//                         }
//                       >
//                         <i className="bi bi-cloud-arrow-up-fill fs-1 text-success"></i>
//                         <span>Upload Excel / CSV</span>
//                         <input
//                           type="file"
//                           id="fileInput"
//                           accept=".csv,.xlsx,.xls"
//                           hidden
//                           onChange={handleFileUpload}
//                         />
//                       </div>

//                       <div className="row mt-3">
//                         <div className="col-6">Extracted: {numbers.length}</div>
//                         <div className="col-6">Unique: {numbers.length}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Result + Message */}
//                   <div className="col-lg-7">
//                     <div className="glass p-4">
//                       <textarea
//                         className="form-control mb-3"
//                         placeholder="Paste or type numbers (one per line)"
//                         value={numbers.join("\n")}
//                         onChange={(e) => {
//                           const lines = e.target.value.split("\n");

//                           const cleaned = lines
//                             .map(cleanNumber)
//                             .filter(Boolean);

//                           setNumbers([...new Set(cleaned)]);
//                         }}
//                         rows={6}
//                       />

//                       <textarea
//                         className="form-control mb-3"
//                         placeholder="Message"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                       />

//                       <select
//                         className="form-select mb-3"
//                         value={interval}
//                         onChange={(e) => setIntervalVal(e.target.value)}
//                       >
//                         <option value="">Select Delay</option>
//                         <option value="2000">2 Seconds</option>
//                         <option value="5000">5 Seconds</option>
//                         <option value="10000">10 Seconds</option>
//                         <option value="15000">15 Seconds</option>
//                         <option value="25000">25 Seconds</option>
//                         <option value="40000">40 Seconds</option>
//                         <option value="60000">60 Seconds</option>
//                       </select>

//                       <button
//                         className="btn btn-success w-100"
//                         onClick={sendCampaign}
//                       >
//                         🚀 Launch Campaign
//                       </button>

//                       <button
//                         className="btn btn-outline-success w-100 mt-2"
//                         onClick={copyNumbers}
//                       >
//                         Copy Numbers
//                       </button>

//                       <button
//                         className="btn btn-danger w-100 mt-2"
//                         onClick={handleLogout}
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Whatsapp;
