import React, { useState } from "react"; // შემოაქვს React და useState ჰუკი მონაცემების სამართავად
import Axios from 'axios'; // შემოაქვს Axios ბექენდთან (API) კომუნიკაციისთვის
import { Link, useNavigate } from "react-router-dom"; // ნავიგაციის ხელსაწყოები გვერდებს შორის გადასასვლელად
import { toast } from 'react-toastify'; // შემოაქვს Popup შეტყობინებების ბიბლიოთეკა

// 1. დამხმარე კომპონენტი (BrandedInput) - ინპუტების ერთიანი სტილისთვის
const BrandedInput = ({ name, placeholder, type = "text", value, onChange, isFocused, setIsFocused }) => (
    <div style={{
      ...styles.inputWrapper, 
      // თუ ველი მონიშნულია (Focus), ეძლევა ლურჯი ჩარჩო და ჩრდილი, თუ არა - სტანდარტული ნაცრისფერი
      borderColor: isFocused === name ? "#4c51bf" : "#e2e8f0",
      boxShadow: isFocused === name ? "0 0 0 4px rgba(76, 81, 191, 0.1)" : "none"
    }}>
      <input 
        type={type} 
        name={name}
        placeholder={placeholder}
        value={value} 
        onChange={onChange}
        onFocus={() => setIsFocused(name)} // როცა მომხმარებელი დააწკაპუნებს ველზე
        onBlur={() => setIsFocused("")} // როცა მომხმარებელი სხვაგან გადავა
        style={styles.cleanInput}
      />
    </div>
);

function Register() {
  // ობიექტი, რომელიც ერთიანად ინახავს რეგისტრაციის ყველა ველის მონაცემს
  const [regData, setRegData] = useState({
    firstName: "", lastName: "", email: "", username: "", birthDate: "", gender: "", password: ""
  });
  
  const [isFocused, setIsFocused] = useState(""); // აკონტროლებს, რომელი ველი აქვს მონიშნული მომხმარებელს
  const navigate = useNavigate(); // ფუნქცია, რომელიც რეგისტრაციის შემდეგ გადაგვიყვანს ლოგინზე

  // რეგისტრაციის მთავარი ფუნქცია
  const register = () => {
    // ვალიდაცია: ვამოწმებთ, რომ აუცილებელი ველები არ იყოს ცარიელი
    if (!regData.email || !regData.username || !regData.password || !regData.firstName || !regData.lastName) {
      toast.warn("გთხოვთ შეავსოთ აუცილებელი ველები"); // ყვითელი Popup გაფრთხილება
      return;
    }
    
    // აგზავნის მონაცემებს სერვერზე (POST მოთხოვნა)
    Axios.post("http://10.201.217.93:3001/register", regData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message); // წარმატების (მწვანე) Popup შეტყობინება
          // 2 წამიანი დაყოვნება, რომ მომხმარებელმა მოასწროს შეტყობინების წაკითხვა
          setTimeout(() => navigate("/login"), 2000); 
        } else {
          toast.error(res.data.message); // სერვერიდან მოსული შეცდომის შეტყობინება
        }
      })
      .catch((err) => {
        // აქ წყდება სერვერის 500 შეცდომის პრობლემა - ეკრანი აღარ "თეთრდება"
        const errorMsg = err.response?.data?.message || "მონაცემები უკვე არსებობს ან სერვერი გათიშულია";
        toast.error(errorMsg); // გამოდის წითელი Popup შეტყობინება
      });
  };

  return (
    <div style={styles.viewPort}> {/* მთლიანი გვერდის გარსი */}
      
      {/* მარცხენა მხარე (ვიზუალური სექცია) */}
      <div style={styles.artSection}>
        <div style={styles.artOverlay}></div> {/* სურათზე მუქი ფერის გადაფარვა ტექსტის საკითხვად */}
        <div style={styles.artContent}>
          <div style={styles.logoBadge}>E</div> {/* პროექტის სიმბოლო */}
          <h1 style={styles.heroTitle}>EDUCITY</h1> {/* მთავარი ლოგო ტექსტი */}
          <p style={styles.heroSubtitle}>თქვენი განათლების ციფრული ეკოსისტემა.</p>
          <div style={styles.artFooter}>© 2026 EDUCITY ყველა უფლება დაცულია</div>
        </div>
      </div>
      
      {/* მარჯვენა მხარე (რეგისტრაციის ფორმა) */}
      <div style={styles.formSection}>
        <div style={styles.formContentWrapper}>
          
          {/* ზედა ნავიგაცია შესვლის ლინკით */}
          <div style={styles.topNav}>
            <p style={styles.topNavText}>უკვე გაქვთ ანგარიში?</p>
            <Link to="/login" style={styles.topNavBtn}>შესვლა</Link>
          </div>

          <div style={styles.formHeader}>
            <h2 style={styles.mainTitle}>შემოუერთდით EduCity-ს</h2>
            <p style={styles.mainSubtitle}>დაარეგისტრირეთ თქვენი პირადი პროფილი</p>
          </div>

          <div style={styles.formBody}>
            {/* სახელი და გვარი (ერთ ხაზზე) */}
            <div style={styles.row}>
              <BrandedInput 
                name="firstName" placeholder="სახელი" value={regData.firstName} isFocused={isFocused} setIsFocused={setIsFocused}
                onChange={(e) => setRegData({...regData, firstName: e.target.value})} 
              />
              <BrandedInput 
                name="lastName" placeholder="გვარი" value={regData.lastName} isFocused={isFocused} setIsFocused={setIsFocused}
                onChange={(e) => setRegData({...regData, lastName: e.target.value})} 
              />
            </div>

            {/* ელ-ფოსტა */}
            <BrandedInput 
              name="email" placeholder="ელ-ფოსტა" type="email" value={regData.email} isFocused={isFocused} setIsFocused={setIsFocused}
              onChange={(e) => setRegData({...regData, email: e.target.value})} 
            />
            
            {/* მომხმარებლის სახელი */}
            <BrandedInput 
              name="username" placeholder="მომხმარებელი" value={regData.username} isFocused={isFocused} setIsFocused={setIsFocused}
              onChange={(e) => setRegData({...regData, username: e.target.value})} 
            />
            
            {/* დაბადების თარიღი და სქესის არჩევა */}
            <div style={styles.row}>
              <div style={{flex: 1.5}}>
                <BrandedInput 
                  name="birthDate" type="date" value={regData.birthDate} isFocused={isFocused} setIsFocused={setIsFocused}
                  onChange={(e) => setRegData({...regData, birthDate: e.target.value})} 
                />
              </div>
              <div style={styles.selectWrapper}>
                <select 
                  name="gender" value={regData.gender} style={styles.cleanSelect}
                  onChange={(e) => setRegData({...regData, gender: e.target.value})} 
                >
                  <option value="">სქესი</option>
                  <option value="male">მამრობითი</option>
                  <option value="female">მდედრობითი</option>
                </select>
              </div>
            </div>

            {/* პაროლი */}
            <BrandedInput 
              name="password" type="password" placeholder="პაროლი" value={regData.password} isFocused={isFocused} setIsFocused={setIsFocused}
              onChange={(e) => setRegData({...regData, password: e.target.value})} 
            />
            
            {/* რეგისტრაციის დადასტურების ღილაკი */}
            <button onClick={register} style={styles.submitBtn}>ანგარიშის შექმნა</button>
            <p style={styles.termsText}>რეგისტრაციით თქვენ ეთანხმებით EduCity-ის <span style={styles.textLink}>წესებსა და პირობებს</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// დიზაინი (Inline CSS Styles)
// ---------------------------------------------------------
const styles = {
  viewPort: { display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
  artSection: { flex: 1.2, position: "relative", background: "#0a0a0a url('https://images.unsplash.com/photo-1523050335456-adaba834597c?q=80&w=2000') no-repeat center center", backgroundSize: "cover", color: "white", display: "flex", justifyContent: "center", alignItems: "center" },
  artOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(76,81,191,0.3) 100%)" },
  artContent: { position: "relative", zIndex: 2, textAlign: "center", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", height: "80%" },
  logoBadge: { background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", color: "white", fontSize: "36px", fontWeight: "900", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" },
  heroTitle: { fontSize: "80px", fontWeight: "900", letterSpacing: "-4px", margin: "0", background: "linear-gradient(180deg, #FFFFFF 0%, #cbd5e0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSubtitle: { fontSize: "18px", opacity: 0.8, marginTop: "20px", maxWidth: "400px" },
  artFooter: { marginTop: "auto", fontSize: "12px", opacity: 0.5 },
  formSection: { flex: 1, backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto", padding: "40px" },
  formContentWrapper: { width: "100%", maxWidth: "480px" },
  topNav: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", marginBottom: "60px" },
  topNavText: { color: "#718096", fontSize: "14px" },
  topNavBtn: { textDecoration: "none", color: "#1a1a1a", border: "1px solid #e2e8f0", padding: "10px 24px", borderRadius: "14px", fontSize: "14px", fontWeight: "600" },
  formHeader: { marginBottom: "40px" },
  mainTitle: { fontSize: "38px", fontWeight: "800", color: "#1a1a1a", letterSpacing: "-1.5px", margin: 0 },
  mainSubtitle: { fontSize: "16px", color: "#718096", marginTop: "10px" },
  formBody: { display: "flex", flexDirection: "column", gap: "18px" },
  row: { display: "flex", gap: "18px" },
  inputWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: "16px", transition: "all 0.2s ease", background: "#fff" },
  cleanInput: { flex: 1, padding: "18px 22px", border: "none", outline: "none", fontSize: "16px", color: "#1a1a1a", background: "transparent", width: "100%" },
  selectWrapper: { flex: 1, border: "1.5px solid #e2e8f0", borderRadius: "16px" },
  cleanSelect: { width: "100%", padding: "18px 22px", border: "none", outline: "none", fontSize: "16px", color: "#718096", background: "transparent", cursor: "pointer" },
  submitBtn: { width: "100%", padding: "20px", background: "#1a1a1a", color: "white", border: "none", borderRadius: "16px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "10px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  termsText: { textAlign: "center", marginTop: "30px", color: "#a0aec0", fontSize: "13px" },
  textLink: { color: "#718096", fontWeight: "600", textDecoration: "underline" }
};

export default Register;