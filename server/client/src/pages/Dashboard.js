import React, { useEffect, useState } from "react"; // შემოაქვს React და ჰუკები: useState (მონაცემებისთვის) და useEffect (გვერდის ჩატვირთვისთვის)
import Axios from "axios"; // შემოაქვს Axios ბიბლიოთეკა ბექენდთან დასაკავშირებლად
import { useNavigate } from "react-router-dom"; // შემოაქვს ნავიგაციის ფუნქცია გვერდებს შორის გადასასვლელად

function Dashboard() {
  const [userList, setUserList] = useState([]); // ქმნის ცვლადს მომხმარებლების სიის შესანახად
  const [activeCount, setActiveCount] = useState(0); // ქმნის ცვლადს ონლაინ მომხმარებლების რაოდენობისთვის
  const [view, setView] = useState("users"); // განსაზღვრავს მიმდინარე ხედს: ცხრილი ("users") თუ პარამეტრები ("settings")
  const navigate = useNavigate(); // ამზადებს ნავიგაციის ხელსაწყოს

  // ქმნის ობიექტს რედაქტირებისთვის და მნიშვნელობებს იღებს ბრაუზერის მეხსიერებიდან (localStorage)
  const [editData, setEditData] = useState({
    firstName: localStorage.getItem("firstName") || "", // იღებს სახელს მეხსიერებიდან
    lastName: localStorage.getItem("lastName") || "", // იღებს გვარს მეხსიერებიდან
    email: localStorage.getItem("userEmail") || "", // იღებს იმეილს მეხსიერებიდან
    oldPassword: "", // ველი ძველი პაროლისთვის (საწყისად ცარიელი)
    newPassword: ""  // ველი ახალი პაროლისთვის (საწყისად ცარიელი)
  });

  // useEffect ეშვება მხოლოდ ერთხელ, გვერდის პირველივე ჩატვირთვისას
  useEffect(() => {
    fetchData(); // იძახებს მონაცემების წამოღების ფუნქციას
  }, []);

  // ფუნქცია მონაცემების ბაზიდან წამოსაღებად
  const fetchData = () => {
    Axios.get("http://10.201.217.93:3001/users").then((res) => setUserList(res.data)); // მოაქვს მომხმარებლების სრული სია
    Axios.get("http://10.201.217.93:3001/active-sessions").then((res) => setActiveCount(res.data.activeCount)); // მოაქვს ონლაინ მომხმარებლების რაოდენობა
  };

  // სისტემიდან გამოსვლის ფუნქცია
  const logout = () => {
    const email = localStorage.getItem("userEmail"); // იღებს მიმდინარე მომხმარებლის იმეილს
    Axios.post("http://10.201.217.93:3001/logout", { email }).then(() => { // სერვერს ატყობინებს გასვლის შესახებ (is_online = 0)
        localStorage.clear(); // შლის ბრაუზერის მეხსიერებას (Login-ის მონაცემებს)
        navigate("/login", { replace: true }); // მომხმარებელი გადაჰყავს Login გვერდზე
    });
  };

  // მონაცემების განახლების ფუნქცია
  const handleUpdate = () => {
    const currentEmail = localStorage.getItem("userEmail"); // იდენტიფიკაციისთვის იყენებს მეხსიერებაში არსებულ იმეილს
    Axios.post("http://10.201.217.93:3001/update-profile", { ...editData, currentEmail }).then((res) => { // აგზავნის ახალ მონაცემებს
      alert(res.data.message); // გამოაქვს შეტყობინება (წარმატება ან შეცდომა)
      if (res.data.success) { // თუ განახლება წარმატებით დასრულდა
        localStorage.setItem("userEmail", editData.email); // ანახლებს იმეილს მეხსიერებაში
        localStorage.setItem("firstName", editData.firstName); // ანახლებს სახელს მეხსიერებაში
        localStorage.setItem("lastName", editData.lastName); // ანახლებს გვარს მეხსიერებაში
        fetchData(); // ანახლებს მონაცემებს ეკრანზე
        setView("users"); // მომხმარებელი აბრუნებს ცხრილის ხედზე
      }
    });
  };

  return (
    <div style={styles.container}> {/* მთავარი კონტეინერი */}
      <aside style={styles.sidebar}> {/* გვერდითა პანელი (Sidebar) */}
        <h2 style={styles.sideLogo}>EDUCITY</h2> {/* ლოგო */}
        <div style={view === "users" ? styles.navItemActive : styles.navItem} onClick={() => setView("users")}>მომხმარებლები</div> {/* ღილაკი ცხრილისთვის */}
        <div style={view === "settings" ? styles.navItemActive : styles.navItem} onClick={() => setView("settings")}>პარამეტრები</div> {/* ღილაკი პარამეტრებისთვის */}
        <button onClick={logout} style={styles.logoutBtn}>გამოსვლა</button> {/* გასვლის ღილაკი */}
      </aside>

      <main style={styles.mainContent}> {/* მთავარი შიგთავსი */}
        <header style={styles.topBar}> {/* ზედა პანელი */}
          <h1 style={styles.pageTitle}>{view === "users" ? "მართვის პანელი" : "პარამეტრები"}</h1> {/* დინამიური სათაური */}
          <div style={styles.userIcon}>{editData.firstName}</div> {/* მომხმარებლის სახელი ზედა კუთხეში */}
        </header>

        <div style={styles.statsRow}> {/* სტატისტიკის სექცია */}
          <div style={styles.statCard}> {/* ბარათი მომხმარებლების რაოდენობისთვის */}
            <h3>ჯამური მომხმარებელი</h3>
            <p style={styles.statNum}>{userList.length}</p> {/* გამოაქვს სიის სიგრძე */}
          </div>
          <div style={styles.statCard}> {/* ბარათი ონლაინ სესიებისთვის */}
            <h3>აქტიური სესია</h3>
            <p style={styles.statNum}>{activeCount}</p> {/* გამოაქვს ონლაინ მომხმარებლების რაოდენობა */}
          </div>
        </div>

        <div style={styles.tableWrapper}> {/* თეთრი ფონი ცხრილისთვის ან ფორმისთვის */}
          {view === "users" ? ( // პირობითი ჩვენება: თუ view არის users, გამოაჩინე ცხრილი
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={styles.th}>სახელი</th>
                    <th style={styles.th}>გვარი</th>
                    <th style={styles.th}>ელ-ფოსტა</th>
                    <th style={styles.th}>სტატუსი</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((val, key) => ( // გადაუყვება მომხმარებლების სიას და სათითაოდ გამოაქვს რიგები
                  <tr key={key} style={styles.tr}>
                    <td style={styles.td}>{val.first_name}</td>
                    <td style={styles.td}>{val.last_name}</td>
                    <td style={styles.td}>{val.email}</td>
                    <td style={styles.td}><span style={styles.statusBadge}>აქტიური</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : ( // წინააღმდეგ შემთხვევაში გამოაჩინე რედაქტირების ფორმა
            <div style={styles.settingsForm}>
              <h3 style={styles.sectionLabel}>პროფილის რედაქტირება</h3>
              <div style={styles.inputRow}>
                <input value={editData.firstName} style={styles.settingsInput} placeholder="სახელი" onChange={(e) => setEditData({...editData, firstName: e.target.value})} />
                <input value={editData.lastName} style={styles.settingsInput} placeholder="გვარი" onChange={(e) => setEditData({...editData, lastName: e.target.value})} />
              </div>
              <input value={editData.email} style={styles.settingsInput} placeholder="ელ-ფოსტა" onChange={(e) => setEditData({...editData, email: e.target.value})} />
              
              <h3 style={styles.sectionLabel}>პაროლის შეცვლა (საჭიროა დადასტურება)</h3>
              <input type="password" style={styles.settingsInput} placeholder="შეიყვანეთ ძველი პაროლი" onChange={(e) => setEditData({...editData, oldPassword: e.target.value})} />
              <input type="password" style={styles.settingsInput} placeholder="ახალი პაროლი" onChange={(e) => setEditData({...editData, newPassword: e.target.value})} />
              
              <button onClick={handleUpdate} style={styles.saveBtn}>მონაცემების განახლება</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// დიზაინის ობიექტი (CSS styles)
const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f4f7fe", fontFamily: "'Inter', sans-serif" },
  sidebar: { width: "260px", background: "#1a202c", color: "white", padding: "40px 20px", display: "flex", flexDirection: "column" },
  sideLogo: { fontSize: "24px", fontWeight: "900", textAlign: "center", marginBottom: "50px", letterSpacing: "2px" },
  navItemActive: { padding: "15px 20px", background: "#4c51bf", borderRadius: "12px", marginBottom: "10px", fontWeight: "600", cursor: "pointer" },
  navItem: { padding: "15px 20px", color: "#a0aec0", borderRadius: "12px", marginBottom: "10px", cursor: "pointer" },
  logoutBtn: { marginTop: "auto", padding: "15px", background: "#e53e3e", border: "none", borderRadius: "12px", color: "white", fontWeight: "700", cursor: "pointer" },
  mainContent: { flex: 1, padding: "40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  pageTitle: { fontSize: "28px", fontWeight: "800", color: "#2d3748" },
  userIcon: { background: "#4c51bf", color: "white", padding: "8px 20px", borderRadius: "20px", fontWeight: "700" },
  statsRow: { display: "flex", gap: "25px", marginBottom: "40px" },
  statCard: { flex: 1, background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.02)" },
  statNum: { fontSize: "32px", fontWeight: "900", margin: "10px 0 0 0", color: "#4c51bf" },
  tableWrapper: { background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "20px", textAlign: "left", color: "#a0aec0", fontSize: "12px", textTransform: "uppercase" },
  td: { padding: "20px", color: "#4a5568", fontWeight: "600", borderTop: "1px solid #f1f5f9" },
  statusBadge: { padding: "6px 12px", background: "#ebfbf2", color: "#38a169", borderRadius: "8px", fontSize: "12px" },
  sectionLabel: { fontSize: "11px", color: "#a0aec0", textTransform: "uppercase", marginBottom: "15px", marginTop: "25px", letterSpacing: "1px" },
  settingsForm: { maxWidth: "550px" },
  inputRow: { display: "flex", gap: "15px" },
  settingsInput: { width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", marginBottom: "15px", outline: "none", boxSizing: "border-box", fontSize: "15px" },
  saveBtn: { width: "100%", padding: "18px", background: "#1a202c", color: "white", border: "none", borderRadius: "14px", fontWeight: "700", cursor: "pointer", fontSize: "16px", marginTop: "10px" }
};

export default Dashboard;