const express = require('express'); // შემოაქვს Express ფრეიმვორკი სერვერის ასაწყობად
const mysql = require('mysql2'); // შემოაქვს MySQL-თან სამუშაო ბიბლიოთეკა
const cors = require('cors'); // შემოაქვს CORS, რათა React-ს მისცეს სერვერთან წვდომის უფლება

const app = express(); // ქმნის Express აპლიკაციას
app.use(express.json()); // სერვერს ასწავლის JSON ფორმატის მონაცემების კითხვას
app.use(cors()); // რთავს CORS-ის მხარდაჭერას

// მონაცემთა ბაზასთან კავშირის პარამეტრები
const db = mysql.createConnection({
    user: 'root', // MySQL-ის მომხმარებელი
    host: 'localhost', // სერვერის მისამართი
    password: '', // MySQL-ის პაროლი (სტანდარტულად ცარიელია)
    database: 'user_system', // მონაცემთა ბაზის სახელი
});

// 1. რეგისტრაციის ენდპოინტი (Plain Text პაროლით)
app.post('/register', (req, res) => {
    // იღებს მონაცემებს React-ის ფორმიდან
    const { firstName, lastName, email, username, birthDate, gender, password } = req.body;
    
    // SQL ბრძანება ახალი მომხმარებლის ჩასამატებლად
    const sql = "INSERT INTO users (first_name, last_name, email, username, birth_date, gender, password) VALUES (?,?,?,?,?,?,?)";
    db.query(sql, [firstName, lastName, email, username, birthDate, gender, password], (err, result) => {
        if (err) {
            console.log(err);
            // თუ იმეილი ან იუზერნეიმი უკვე არსებობს, აბრუნებს შეცდომას
            return res.status(500).send({ message: "მომხმარებელი უკვე არსებობს" });
        }
        res.send({ success: true, message: "რეგისტრაცია წარმატებულია!" });
    });
});

// 2. ავტორიზაციის ენდპოინტი (Login)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // ეძებს მომხმარებელს სახელით
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).send(err);
        
        if (result.length > 0) {
            // ადარებს შეყვანილ პაროლს ბაზაში არსებულ პაროლს (ტექსტური შედარება)
            if (password === result[0].password) {
                // თუ სწორია, მომხმარებელს უცვლის სტატუსს ონლაინზე (is_online = 1)
                db.query("UPDATE users SET is_online = 1 WHERE id = ?", [result[0].id]);
                res.send({ success: true, user: result[0] });
            } else {
                res.send({ success: false, message: "პაროლი არასწორია" });
            }
        } else {
            res.send({ success: false, message: "მომხმარებელი ვერ მოიძებნა" });
        }
    });
});

// 3. გამოსვლის ენდპოინტი (Logout)
app.post('/logout', (req, res) => {
    const { email } = req.body;
    // გასვლისას მომხმარებელს სტატუსს უცვლის ოფლაინზე (is_online = 0)
    db.query("UPDATE users SET is_online = 0 WHERE email = ?", [email], (err, result) => {
        res.send({ success: true });
    });
});

// 4. პროფილის განახლება
app.post('/update-profile', (req, res) => {
    const { firstName, lastName, email, oldPassword, newPassword, currentEmail } = req.body;

    // ჯერ ამოწმებს მიმდინარე მომხმარებლის ძველ პაროლს
    db.query("SELECT password FROM users WHERE email = ?", [currentEmail], (err, result) => {
        if (err || result.length === 0) return res.status(500).send({ message: "შეცდომა" });

        // თუ მომხმარებელს პაროლის შეცვლა უნდა, ამოწმებს ემთხვევა თუ არა ძველი პაროლი
        if (newPassword && newPassword.trim() !== "") {
            if (oldPassword !== result[0].password) {
                return res.send({ success: false, message: "ძველი პაროლი არასწორია!" });
            }
        }

        // აწყობს განახლების SQL ბრძანებას
        let query = "UPDATE users SET first_name = ?, last_name = ?, email = ?";
        let params = [firstName, lastName, email];

        // თუ ახალი პაროლი შეყვანილია, ამატებს მას განახლების სიაში
        if (newPassword && newPassword.trim() !== "") {
            query += ", password = ?";
            params.push(newPassword);
        }

        query += " WHERE email = ?";
        params.push(currentEmail);

        db.query(query, params, (err, updateResult) => {
            if (err) return res.status(500).send({ success: false, message: "Email უკვე არსებობს" });
            res.send({ success: true, message: "მონაცემები წარმატებით განახლდა!" });
        });
    });
});

// 5. სტატისტიკა: ყველა მომხმარებლის წამოღება
app.get('/users', (req, res) => {
    db.query("SELECT first_name, last_name, email FROM users", (err, result) => {
        res.send(result);
    });
});

// 6. სტატისტიკა: მხოლოდ ონლაინ მყოფი მომხმარებლების რაოდენობა
app.get('/active-sessions', (req, res) => {
    db.query("SELECT COUNT(*) as activeCount FROM users WHERE is_online = 1", (err, result) => {
        res.send(result[0]);
    });
});

// სერვერის გაშვება 3001 პორტზე
app.listen(3001, () => console.log("Server is running on port 3001"));