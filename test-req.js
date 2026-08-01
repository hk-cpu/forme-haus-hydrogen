fetch('http://localhost:3000/api/newsletter', {
  method: 'POST',
  body: new URLSearchParams({email: 'test_script@example.com'}),
}).then(async (r) => {
  console.log(r.status, await r.text());
});
