/**
 * @description  this filters out unwanted field in as object
 */
export default (obj: any, ...notAllowedFields: any[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (!notAllowedFields.includes(el)) newObj[el] = obj[el];
  });
  console.log(newObj);
  return newObj;
};
