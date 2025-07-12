"use client";

import { useMemo } from "react";
import {
  UseFormRegister,
  FieldErrors,
  useWatch,
  Control,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import { ICheckoutForm } from "@/validation";
import { useCartStore } from "@/store";
import states from "@/public/data/us_state.json";

interface Props {
  register: UseFormRegister<ICheckoutForm>;
  errors: FieldErrors<ICheckoutForm>;
  control: Control<ICheckoutForm>;
  trigger: UseFormTrigger<ICheckoutForm>;
  setValue: UseFormSetValue<ICheckoutForm>;
}

export default function StateSection({
  register,
  errors,
  control,
  setValue,
  trigger,
}: Props) {
  const stateList = useMemo(
    () => [...states].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const setStateCode = useCartStore((s) => s.setStateCode);

  useWatch({ control, name: "state" });
  useWatch({ control, name: "zipCode" });

  return (
    <div className="flex flex-row gap-4 items-start min-h-[106px]">
      <div className="rinarah-checkout-box">
        <input
          type="text"
          id="city"
          placeholder="City"
          className="rinarah-checkout-input"
          {...register("city", { required: true })}
        />
        <label htmlFor="city" className="rinarah-checkout-label">
          City
        </label>
        {errors.city && (
          <span className="rinarah-error-message">City is required</span>
        )}
      </div>

      {/* State */}
      <div className="rinarah-checkout-box relative">
        <select
          id="state"
          autoComplete="address-level1"
          className="rinarah-checkout-select"
          {...register("state", {
            required: true,
            onChange: (e) => setStateCode(e.target.value),
          })}
        >
          <option value="">Select a state</option>
          {stateList.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
        <label htmlFor="state" className="rinarah-checkout-label-state">
          State
        </label>
        <span className="rinarah-checkout-arrow">
          <IoIosArrowDown />
        </span>
        {errors.state && (
          <span className="rinarah-error-message">State is required</span>
        )}
      </div>


      <div className="rinarah-checkout-box">
        <input
          type="text"
          id="zipCode"
          autoComplete="postal-code"
          
          placeholder="ZIP Code"
          maxLength={5}
          pattern="\d{5}"
          className="rinarah-checkout-input"
          {...register("zipCode", {
            required: true,
            onBlur: (e) => {
              setValue("zipCode", e.target.value);
              trigger("zipCode");
            },
          })}
        />
        <label htmlFor="zipCode" className="rinarah-checkout-label">
          ZIP Code
        </label>
        {errors.zipCode && (
          <span className="rinarah-error-message">
            {errors.zipCode.message || "ZIP Code is required"}
          </span>
        )}
      </div>
    </div>
  );
}
