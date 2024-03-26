// ! all the mongoose error types are located here. We could make separate functions for each if we wanted to.
// https://mongoosejs.com/docs/api/error.html

// ! Function to convert a mongoose error into a human readable format for our frontend.
export default function formatValidationError(err: any) {
  const customError: any = {}
  for (const key in err.errors) {
    customError[key] = err.errors[key].message
  }
  return customError
}