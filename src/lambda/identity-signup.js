// note - this function MUST be named `identity-signup` to work
// we do not yet offer local emulation of this functionality in Netlify Dev
//
// more:
// https://www.netlify.com/blog/2019/02/21/the-role-of-roles-and-how-to-set-them-in-netlify-identity/
// https://www.netlify.com/docs/functions/#identity-and-functions

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));
  console.log(`Bearer ${process.env.FAUNA_SERVER_KEY}`);

  //netlify user ID
  const netlifyID = user.id;

  // stripe customer ID
  const stripeID = 2;

  //call to Fauna DB
  const response = await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
    },
    body: JSON.stringify({
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
