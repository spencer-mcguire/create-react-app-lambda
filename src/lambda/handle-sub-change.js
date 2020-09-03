import axios from 'axios';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function ({ body, headers }, context) {
  try {
    // make sure this event was sent legitimately.
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // bail if this is not a subscription update event
    if (stripeEvent.type !== 'customer.subscription.updated') return;

    const subscription = stripeEvent.data.object;

    const result = await axios({
      method: 'post',
      url: 'https://graphql.fauna.com/graphql',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
      },
      data: {
        query: `
          query ($stripeID: ID!) {
            getUserByStripeID(stripeID: $stripeID) {
              netlifyID
            }
          }
                `,
        variables: {
          stripeID: subscription.customer,
        },
      },
    })
      .then((res) => res.data)
      .catch((err) => console.error(JSON.stringify(err, null, 2)));

    const { netlifyID } = result.data.getUserByStripeID;
    console.log(result);
    // take the first word of the plan name and use it as the role
    const plan = subscription.items.data[0].plan.nickname;
    const role = plan.split(' ')[0].toLowerCase();

    const { identity } = context.clientContext;
    console.log(identity);

    // send a call to the Netlify Identity admin API to update the user role
    await axios({
      method: 'put',
      url: `${identity.url}/admin/users/${netlifyID}`,
      headers: {
        Accept: 'application/json',
        // note that this is a special admin token for the Identity API
        Authorization: `Bearer ${identity.token}`,
      },
      data: {
        app_metadata: {
          roles: [role],
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
