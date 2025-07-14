const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://pallimahesh2001:Mahesh123@cluster0.wqq3y4s.mongodb.net/urlShortenerDB')
  .then(() => {
    console.log(' MongoDB connected successfully');
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, unique: true },
  originalUrl: String,
  email: String,
  name: String,
  mobileNo: String,
  githubUsername: String,
  rollNo: String,
  accessCode: String,
  clientId: String,
  clientSecret: String,
  createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);


app.post('/api/shorten', async (req, res) => {
  const {
    originalUrl,
    email,
    name,
    mobileNo,
    githubUsername,
    rollNo,
    accessCode,
    clientId,
    clientSecret
  } = req.body;

  let shortCode;
  let exists = true;

  while (exists) {
    shortCode = nanoid(6);
    const existing = await Url.findOne({ shortCode });
    if (!existing) exists = false;
  }

  const newUrl = new Url({
    shortCode,
    originalUrl,
    email,
    name,
    mobileNo,
    githubUsername,
    rollNo,
    accessCode,
    clientId,
    clientSecret
  });

  await newUrl.save();

  res.json({ shortCode });
});

app.get('/api/lookup/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const ageMinutes = (Date.now() - url.createdAt.getTime()) / (1000 * 60);
  if (ageMinutes > 30) {
    return res.status(410).json({ error: 'Short URL expired' });
  }

  res.json({
    name: url.name,
    email: url.email,
    rollNo: url.rollNo,
    accessCode: url.accessCode,
    clientId: url.clientId,
    clientSecret: url.clientSecret
  });
});


app.listen(5000, () => console.log('Backend running on port 5000'));


