// note - this function MUST be named `identity-signup` to work
// we do not yet offer local emulation of this functionality in Netlify Dev
//
// more:
// https://www.netlify.com/blog/2019/02/21/the-role-of-roles-and-how-to-set-them-in-netlify-identity/
// https://www.netlify.com/docs/functions/#identity-and-functions

exports.handler = async function (event, context) {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));
  return {
    statusCode: 200,

    body: JSON.stringify({ app_metadata: { roles: ['sub:free'] } }),
  };
};
