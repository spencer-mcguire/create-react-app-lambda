import axios from 'axios';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  const { user } = context.clientContext;
  console.log(user.sub);

  const result = await axios({
    method: 'post',
    url: 'https://graphql.fauna.com/graphql',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
    },
    data: {
      query: `
            query ($netlifyID: ID!) {
              getUserByNetlifyID(netlifyID: $netlifyID) {
                stripeID
              }
            }
            `,
      variables: {
        netlifyID: user.sub,
      },
    },
  })
    .then((res) => res.data)
    .catch((err) => console.error(JSON.stringify(err, null, 2)));

  const stripeID = result.data.getUserByNetlifyID.stripeID;

  var link = await stripe.billingPortal.sessions.create({
    customer: stripeID,
    return_url: process.env.URL,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(link.url),
  };
};
