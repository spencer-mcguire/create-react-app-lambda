// note - this function MUST be named `identity-signup` to work
// we do not yet offer local emulation of this functionality in Netlify Dev
//
// more:
// https://www.netlify.com/blog/2019/02/21/the-role-of-roles-and-how-to-set-them-in-netlify-identity/
// https://www.netlify.com/docs/functions/#identity-and-functions

// const fetch = require('node-fetch');

import axios from 'axios';

exports.handler = async function (event, context) {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));
  console.log(`Bearer ${process.env.FAUNA_SERVER_KEY}`);

  //netlify user ID
  const netlifyID = user.id;

  // stripe customer ID
  const stripeID = 2;

  //call to Fauna DB
  const response = await axios({
    method: 'post',
    url: 'https://graphql.fauna.com/graphql',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
    },
    data: JSON.stringify({
      query: `
      mutation($netlifyID: ID! $stripeID: ID!){
        createUser( data:{netlifyID: $netlifyID, stripeID: $stripeID }){
          netlifyID
          stripeID
        }
      }`,
      variables: {
        netlifyID,
        stripeID,
      },
    }),
  })
    .then((res) => res.JSON())
    .catch((err) => console.error(JSON.stringify(err, null, 2)));

  console.log('response', { response });

  return {
    statusCode: 200,

    body: JSON.stringify({ app_metadata: { roles: ['sub:free'] } }),
  };
};
