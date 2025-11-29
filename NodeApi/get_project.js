import renderApi from '@api/render-api';

renderApi.auth('rnd_ckPGUIDiyXNLMMVD3UDdbovzAqKK');
renderApi.listServices({environmentId: '', includePreviews: 'true', limit: '20'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));