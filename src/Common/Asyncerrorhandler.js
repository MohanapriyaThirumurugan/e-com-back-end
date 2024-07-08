const asyncerrorhandler = func => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);

export default asyncerrorhandler;

// this for async function
