const encodeBase64Url = (
  str: string,
  option: BufferEncoding = "base64url"
): string => {
  let txt: string;
  txt = Buffer.from(`${str}`).toString(option);
  return txt;
};

const decodeBase64Url = (
  str: string,
  option: BufferEncoding = "base64url"
): string => {
  return Buffer.from(`${str}`, option).toString("ascii");
};

export { encodeBase64Url, decodeBase64Url };
