import React, { useState } from "react"; // შემოაქვს React-ის ბიბლიოთეკა და useState ჰუკი
import Axios from 'axios'; // შემოაქვს Axios ბექენდთან (სერვერთან) დასაკავშირებლად
import { Link, useNavigate } from "react-router-dom"; // შემოაქვს ნავიგაციის ინსტრუმენტები
import { toast } from 'react-toastify'; // შემოაქვს Popup შეტყობინებების ბიბლიოთეკა

function Login() {
  // 1. სტეიტების განსაზღვრა მომხმარებლის მონაცემებისთვის
  const [username, setUsername] = useState(""); // ცვლადი მომხმარებლის სახელის შესანახად
  const [password, setPassword] = useState(""); // ცვლადი პაროლის შესანახად
  
  // 2. ვიზუალური ეფექტების სტეიტი
  const [isFocused, setIsFocused] = useState(""); // აკონტროლებს, რომელი ინპუტია აქტიური (დიზაინისთვის)
  
  // 3. ნავიგაციის ფუნქციის ინიციალიზაცია
  const navigate = useNavigate(); // გამოიყენება გვერდებს შორის გადასასვლელად

  // 4. სისტემაში შესვლის (ავტორიზაციის) მთავარი ფუნქცია
  const login = () => {
    // აგზავნის POST მოთხოვნას სერვერზე მომხმარებლის მონაცემებით
    Axios.post("http://10.201.217.93:3001/login", { 
        username: username, 
        password: password 
    })
    .then((res) => {
      // თუ სერვერმა წარმატებით დაადასტურა მონაცემები
      if (res.data.success) { 
        // გამოდის წარმატების შეტყობინება
        toast.success("წარმატებით გაიარეთ ავტორიზაცია!");
        
        // ინახავს მომხმარებლის ინფორმაციას ბრაუზერის ლოკალურ მეხსიერებაში (localStorage)
        localStorage.setItem("isLoggedIn", "true"); // აღნიშნავს, რომ მომხმარებელი შესულია
        localStorage.setItem("userEmail", res.data.user.email); // ინახავს იმეილს
        localStorage.setItem("firstName", res.data.user.first_name); // ინახავს სახელს
        localStorage.setItem("lastName", res.data.user.last_name); // ინახავს გვარს
        
        // გადამისამართება Dashboard გვერდზე 1 წამში (რომ მომხმარებელმა მოასწროს Popup-ის ნახვა)
        setTimeout(() => {
            navigate("/dashboard", { replace: true });
        }, 1000);
        
      } else { 
        // თუ მონაცემები არასწორია (მაგ: არასწორი პაროლი), გამოაქვს შეცდომა
        toast.error(res.data.message); 
      }
    })
    .catch((err) => {
      // თუ სერვერთან კავშირი საერთოდ ვერ დამყარდა (500 შეცდომა ან სერვერი გამორთულია)
      const errorMsg = err.response?.data?.message || "სერვერთან კავშირი ვერ დამყარდა";
      toast.error(errorMsg); // გამოდის წითელი Popup შეტყობინება
    });
  };

  return (
    <div style={styles.wrapper}> {/* მთავარი გარსი, რომელიც იკავებს მთელ ეკრანს */}
      <div style={styles.loginCard}> {/* ავტორიზაციის თეთრი ბლოკი */}
        
        {/* ზედა ნაწილი: ლოგო და სათაურები */}
        <div style={styles.header}> 
            <div style={styles.logoBadge}>E</div> {/* ლოგოს მრგვალი სიმბოლო "E" */}
            <h1 style={styles.logo}>EDUCITY</h1> {/* პროექტის მთავარი სათაური */}
            <p style={styles.subtitle}>კეთილი იყოს თქვენი მობრძანება</p> {/* დამხმარე ტექსტი */}
        </div>
        
        {/* ფორმის შუა ნაწილი: ინპუტები და ღილაკები */}
        <div style={styles.body}> 
          
          {/* მომხმარებლის სახელის (Username) ველი */}
          <div style={styles.inputWrapper}>
            <label style={styles.label}>მომხმარებელი</label> {/* ველის სათაური */}
            <div style={{
                ...styles.fieldContainer, 
                // თუ ველი აქტიურია, იღებს მუქ ჩარჩოს, თუ არა - ღიას
                borderColor: isFocused === "user" ? "#4c51bf" : "#f1f5f9"
            }}>
                <input 
                    placeholder="შეიყვანეთ სახელი" 
                    onChange={(e) => setUsername(e.target.value)} // აახლებს username ცვლადს
                    onFocus={() => setIsFocused("user")} // ააქტიურებს ფოკუსს
                    onBlur={() => setIsFocused("")} // თიშავს ფოკუსს სხვაგან დაჭერისას
                    style={styles.field} 
                />
            </div>
          </div>

          {/* პაროლის (Password) ველი */}
          <div style={styles.inputWrapper}>
            <label style={styles.label}>პაროლი</label>
            <div style={{
                ...styles.fieldContainer, 
                borderColor: isFocused === "pass" ? "#4c51bf" : "#f1f5f9"
            }}>
                <input 
                    type="password" // პაროლს აჩვენებს წერტილებად უსაფრთხოებისთვის
                    placeholder="••••••••" 
                    onChange={(e) => setPassword(e.target.value)} // აახლებს password ცვლადს
                    onFocus={() => setIsFocused("pass")} // ააქტიურებს ფოკუსს პაროლზე
                    onBlur={() => setIsFocused("")}
                    style={styles.field} 
                />
            </div>
          </div>

          {/* სისტემაში შესვლის მთავარი ღილაკი */}
          <button 
            onClick={login} // დაჭერისას იძახებს ავტორიზაციის ფუნქციას
            style={styles.loginBtn}
          >
            სისტემაში შესვლა
          </button>
          
          {/* ვიზუალური გამყოფი "ან" ტექსტით */}
          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>ან</span>
            <span style={styles.dividerLine}></span>
          </div>
          
          {/* რეგისტრაციაზე გადასასვლელი ღილაკი */}
          <Link to="/register" style={styles.secondaryBtn}>
            ახალი ანგარიშის შექმნა
          </Link>
        </div>

        {/* ქვედა ნაწილი: საავტორო უფლებები */}
        <p style={styles.footerText}>© 2026 EDUCITY</p> 
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// დიზაინის ობიექტი (Inline CSS Styles)
// ---------------------------------------------------------
const styles = {
  wrapper: { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    minHeight: "100vh", 
    backgroundColor: "#f4f7fe", // ფონის ღია ფერი
    fontFamily: "'Inter', sans-serif" 
  },
  loginCard: { 
    width: "100%", 
    maxWidth: "440px", 
    background: "white", 
    borderRadius: "32px", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.04)", 
    padding: "60px 45px",
    boxSizing: "border-box" 
  },
  header: { 
    textAlign: "center", 
    marginBottom: "40px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  logoBadge: { 
    background: "#1a202c", 
    color: "white", 
    width: "50px", 
    height: "50px", 
    borderRadius: "14px", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    fontSize: "24px", 
    fontWeight: "900",
    marginBottom: "15px"
  },
  logo: { 
    fontSize: "32px", 
    fontWeight: "900", 
    color: "#1a202c", 
    margin: 0, 
    letterSpacing: "-1px" 
  },
  subtitle: { 
    color: "#718096", 
    fontSize: "15px", 
    marginTop: "8px" 
  },
  inputWrapper: { 
    marginBottom: "22px" 
  },
  label: { 
    display: "block", 
    fontSize: "12px", 
    fontWeight: "800", 
    color: "#a0aec0", 
    textTransform: "uppercase", 
    marginBottom: "10px", 
    letterSpacing: "0.5px" 
  },
  fieldContainer: {
    border: "2px solid #f1f5f9",
    borderRadius: "16px",
    transition: "all 0.2s ease",
    background: "#f8fafc",
  },
  field: { 
    width: "100%", 
    padding: "16px 20px", 
    border: "none", 
    background: "transparent", 
    boxSizing: "border-box", 
    fontSize: "16px",
    outline: "none",
    color: "#1a202c"
  },
  loginBtn: { 
    width: "100%", 
    padding: "18px", 
    background: "#1a202c", 
    color: "white", 
    border: "none", 
    borderRadius: "16px", 
    fontWeight: "700", 
    cursor: "pointer", 
    marginTop: "10px",
    fontSize: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease"
  },
  divider: { 
    display: "flex", 
    alignItems: "center", 
    margin: "25px 0" 
  },
  dividerLine: { 
    flex: 1, 
    height: "1px", 
    background: "#edf2f7" 
  },
  dividerText: { 
    margin: "0 15px", 
    color: "#cbd5e0", 
    fontSize: "13px", 
    fontWeight: "600" 
  },
  secondaryBtn: { 
    display: "block", 
    textAlign: "center", 
    width: "100%", 
    padding: "16px", 
    border: "2px solid #e2e8f0", 
    borderRadius: "16px", 
    color: "#4a5568", 
    textDecoration: "none", 
    fontWeight: "700", 
    boxSizing: "border-box",
    fontSize: "15px",
    transition: "all 0.2s ease"
  },
  footerText: { 
    textAlign: "center", 
    marginTop: "40px", 
    fontSize: "12px", 
    color: "#cbd5e0", 
    fontWeight: "600", 
    letterSpacing: "1px" 
  }
};

export default Login;