"use client";
import {
  useWatch,
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ICheckoutForm } from "@/validation";
import { ShippingRateInfo } from "@/types";
import { isZipCodeInState } from "@/utils";
import { ShippingSkeleton } from "@/loading";
import styles from "./styles.module.css";
import { useCartStore } from "@/store";

type Props = {
  control: Control<ICheckoutForm>;
  register: UseFormRegister<ICheckoutForm>;
  errors: FieldErrors<ICheckoutForm>;
  setValue: UseFormSetValue<ICheckoutForm>;
  weight: number;
};

export default function ShippingList({
  control,
  weight,
  setValue,
  register,
  errors,
}: Props) {
  const { address, state, zipCode, city, country } = useWatch({ control });

  const isValidAddress = useMemo(
    () => Boolean(address && state && zipCode && city && country),
    [address, state, zipCode, city, country]
  );

  const isZipValid = useMemo(
    () => (zipCode && state ? isZipCodeInState(String(zipCode), state) : false),
    [zipCode, state]
  );

  const [rates, setRates] = useState<ShippingRateInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setShippingCost = useCartStore((s) => s.setShippingCost);

  const fetchRates = useCallback(async () => {
    if (!isValidAddress || !isZipValid || weight <= 0) return;

    setError(null);
    setRates(null);

    try {
      const res = await fetch("/api/shipping/shippingList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerAddress: {
            name: "test",
            phone: "5541222251",
            email: "hilmy7132@gmail.com",
            street1: address,
            city,
            state,
            zip: zipCode,
            country,
          },
          parcel: {
            length: 12,
            width: 12,
            height: 6.7,
            weight,
            distance_unit: "in",
            mass_unit: "oz",
          },
        }),
      });

      const data: ShippingRateInfo[] = await res.json();
      setRates(data);
    } catch (err) {
      console.error("Error fetching shipping rates:", err);
      setRates([]);
    }
  }, [
    address,
    city,
    country,
    isValidAddress,
    isZipValid,
    state,
    weight,
    zipCode,
  ]);

  useEffect(() => {
    const id = setTimeout(() => fetchRates(), 250);
    return () => clearTimeout(id);
  }, [fetchRates]);

  useEffect(() => {
    setSelectedId(null);
    setShippingCost(0);
    setValue(
      "shippingInfo",
      { objectId: "", rate: 0 },
      { shouldValidate: true }
    );
  }, [address, city, state, zipCode, country, setValue, setShippingCost]);

  if (!isValidAddress || !isZipValid) {
    return (
      <div className={styles.noShipping}>
        <span className={styles.noShippingText}>
          Enter your shipping address to view available shipping methods.
        </span>
      </div>
    );
  }

  if (rates === null && !error) return <ShippingSkeleton />;

  if (error) {
    return (
      <div className={styles.noShipping}>
        <span className={styles.noShippingText}>{error}</span>
      </div>
    );
  }

  if (rates && rates.length === 0) {
    return (
      <div className={styles.noShipping}>
        <span className={styles.noShippingText}>
          No shipping methods available for this address.
        </span>
      </div>
    );
  }

  return (
    <ul className={styles.shippingList}>
      {rates?.map((rate) => (
        <li
          key={rate.object_id}
          className={`${styles.shippingListItem} ${
            selectedId === rate.object_id ? styles.active : ""
          }`}
          onClick={() => {
            setSelectedId(rate.object_id);
            setShippingCost(Number(rate.amount));
            setValue("shippingInfo", {
              objectId: rate.object_id,
              rate: Number(rate.amount),
            });
          }}
        >
          <div>
            <input
              type="radio"
              value={rate.object_id}
              {...register("shippingInfo.objectId", {
                required: true,
              })}
              checked={selectedId === rate.object_id}
            />
          </div>

          <div className="flex justify-between items-center gap-2 flex-grow">
            <div className="flex-grow flex-4/5">
              <div>{rate.servicelevel.name}</div>
              <div>{rate.duration_terms}</div>
            </div>
            <div className={styles.shippingRate}>
              <div>{rate.amount} $</div>
            </div>
          </div>
        </li>
      ))}

      {errors?.shippingInfo?.objectId && (
        <span className="rinarah-error-message">
          Please select a shipping method
        </span>
      )}
    </ul>
  );
}
