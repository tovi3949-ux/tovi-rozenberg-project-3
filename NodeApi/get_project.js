import renderApi from '@api/render-api';

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const renderApi = new renderApi();
    renderApi.auth('rnd_ckPGUIDiyXNLMMVD3UDdbovzAqKK');
    const { data } = await renderApi.listServices({ includePreviews: true, limit: 20 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});