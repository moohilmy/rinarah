import zipcodes from "zipcodes";
export const isZipCodeInState = (
  zipCode: string,
  stateCode: string
): boolean => {
  const zipCodeList = zipcodes.lookupByState(stateCode);
  
  const clientCode = zipCodeList.find((zip) => zip.zip === zipCode);
  if (!clientCode) {
    return false;
  }
  return true;
};
