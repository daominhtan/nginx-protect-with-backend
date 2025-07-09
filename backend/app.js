const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const SECRET = "your_jwt_secret";

app.use(bodyParser.json());

// ✅ Giả lập user database
const users = {
  admin: {
    password: "admin",
    stores: ["store1", "store2", "store3"]
  },
  user1: {
    password: "123456",
    stores: ["store2"]
  }
};

// ✅ API LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      user: username,
      stores: user.stores
    },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ✅ AUTH CHECK
app.get('/auth-check', (req, res) => {
  const token = req.headers.authorization || '';
  const uri = req.headers['x-original-uri'] || '';

  try {
    const decoded = jwt.verify(token, SECRET);
    const allowedStores = decoded.stores || [];

    const match = uri.match(/^\/(store\d+)\//);
    const store = match ? match[1] : null;

    if (!store || !allowedStores.includes(store)) {
      return res.sendStatus(403); // Không có quyền
    }

    return res.sendStatus(200); // OK
  } catch (e) {
    return res.sendStatus(401); // Token lỗi
  }
});

app.listen(3000, () => console.log("Auth-check server running on 3000"));
