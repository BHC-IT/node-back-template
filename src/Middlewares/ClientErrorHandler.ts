export default function clientErrorHandler (err : any, req : any, res : any, next : Function) {
  // console.log('clientErrorHandler : ', err);
  if (req.xhr) {
    res.status(err.code).json({ error: err.name, message: err.message });
  } else {
    return next(err);
  }
}
