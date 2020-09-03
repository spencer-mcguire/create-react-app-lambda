// import axios from 'axios';

// exports.faunaAxios = async function ({ query, variables }) {
//   return await axios({
//     method: 'post',
//     url: 'https://graphql.fauna.com/graphql',
//     headers: {
//       Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
//     },
//     data: JSON.stringify({
//       query,
//       variables,
//     }),
//   })
//     .then((res) => res.json())
//     .catch((err) => console.error(JSON.stringify(err, null, 2)));
// };

const fetch = require('node-fetch');

exports.faunaFetch = async function ({ query, variables }) {
  return await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(JSON.stringify(err, null, 2)));
};
