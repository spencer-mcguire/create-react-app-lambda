exports.handler = async (...args) => {
  //test
  console.log(JSON.stringify(args, null, 2));

  return {
    statusCode: 200,
    body: 'ok',
  };
};
