const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to DB. Container: ${process.env.HOSTNAME}`))
  .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({ name: String });
const User = mongoose.model('User', UserSchema);

// WRITES: Handled by Primary DB
app.post('/users', async (req, res) => {
  try {
    const user = new User({ name: req.body.name });
    await user.save();
    res.send(`User created successfully by server: ${process.env.HOSTNAME}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READS: Handled by Secondary DBs (secondaryPreferred)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(`Fetched ${users.length} users. Handled by server: ${process.env.HOSTNAME}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));