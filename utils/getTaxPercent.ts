import state from "@/public/data/us_state.json";

export const getTaxPercent = ( stateCode: string): number => {
  const selectedState = state.find((s) => s.isoCode === stateCode);

  const taxRate = selectedState?.salesTax ?? 0;

  return taxRate;
};
