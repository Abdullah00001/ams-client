/**
 * @fileoverview Payment Plan Section Component
 * @module features/create-student/components/payment-plan-section
 */

"use client";

import { Check, CreditCard, Layers } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import type {
  CreateStudentFormData,
  DiscountType,
  InstallmentPlanItem,
  PaymentType,
} from "../types";
import { formatBDT } from "../lib";
import { InstallmentScheduleTable } from "./installment-schedule-table";
import styles from "../styles/payment-plan-section.module.css";

interface PaymentPlanSectionProps {
  formData: CreateStudentFormData;
  baseFee: number;
  discountAmount: number;
  netFee: number;
  installments: InstallmentPlanItem[];
  onFieldChange: <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => void;
}

const DISCOUNT_OPTIONS = [
  { value: "none" as DiscountType, label: "No Discount" },
  { value: "percentage" as DiscountType, label: "Percentage Discount (%)" },
  { value: "fixed" as DiscountType, label: "Fixed Deduction (৳ BDT)" },
];

const INSTALLMENT_COUNT_OPTIONS = [
  { value: "2", label: "2 Installments" },
  { value: "3", label: "3 Installments" },
  { value: "4", label: "4 Installments" },
];

export function PaymentPlanSection({
  formData,
  baseFee,
  discountAmount,
  netFee,
  installments,
  onFieldChange,
}: PaymentPlanSectionProps) {
  const isInstallment = formData.paymentType === "installment";

  return (
    <section className={styles.section} aria-labelledby="section-payment-plan">
      <div className={styles.sectionHeader}>
        <h2 id="section-payment-plan" className={styles.sectionTitle}>
          Payment Plan & Fee Structure
        </h2>
        <p className={styles.sectionSubtitle}>
          Configure course fee billing, discount waivers, full payment or customized installment breakdown.
        </p>
      </div>

      {/* Row 1: Course Base Fee & Discount Controls */}
      <div className={styles.grid3Col}>
        <div className={styles.feeHighlightCard}>
          <span className={styles.cardLabel}>Standard Course Fee</span>
          <span className={styles.cardValue}>{formatBDT(baseFee)}</span>
          <span className={styles.cardSubtext}>Applicable base tuition fee</span>
        </div>

        <div className={styles.fieldGroup}>
          <Dropdown<DiscountType>
            id="discountType"
            label="Discount / Scholarship"
            value={formData.discountType}
            onChange={(val) => {
              onFieldChange("discountType", val);
              if (val === "none") onFieldChange("discountValue", 0);
            }}
            options={DISCOUNT_OPTIONS}
            fullWidth
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="discountValue" className={styles.fieldLabel}>
            {formData.discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (৳)"}
          </label>
          <input
            id="discountValue"
            type="number"
            min={0}
            max={formData.discountType === "percentage" ? 100 : baseFee}
            disabled={formData.discountType === "none"}
            value={formData.discountValue || ""}
            onChange={(e) => onFieldChange("discountValue", Number(e.target.value) || 0)}
            placeholder={formData.discountType === "none" ? "None" : "e.g. 10"}
            className={styles.inputField}
          />
          {discountAmount > 0 ? (
            <span className={styles.discountHelp}>
              Saved: <strong>{formatBDT(discountAmount)}</strong>
            </span>
          ) : null}
        </div>
      </div>

      {/* Payment Type Selection (Cards) */}
      <div className={styles.paymentTypeGroup}>
        <label className={styles.fieldLabel}>Payment Mode</label>
        <div className={styles.paymentCardsGrid}>
          <button
            type="button"
            onClick={() => onFieldChange("paymentType", "full" as PaymentType)}
            className={`${styles.paymentCard} ${!isInstallment ? styles.paymentCardActive : ""}`}
          >
            <div className={styles.cardIcon}>
              <CreditCard size={18} />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardTitle}>Full Payment</span>
              <span className={styles.cardDesc}>Single payment of net tuition fee at admission</span>
            </div>
            {!isInstallment ? (
              <div className={styles.cardCheck}>
                <Check size={14} />
              </div>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => onFieldChange("paymentType", "installment" as PaymentType)}
            className={`${styles.paymentCard} ${isInstallment ? styles.paymentCardActive : ""}`}
          >
            <div className={styles.cardIcon}>
              <Layers size={18} />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardTitle}>Installment Plan</span>
              <span className={styles.cardDesc}>Split course fee into monthly or bi-weekly milestone dues</span>
            </div>
            {isInstallment ? (
              <div className={styles.cardCheck}>
                <Check size={14} />
              </div>
            ) : null}
          </button>
        </div>
      </div>

      {/* Installment Configuration (If installment selected) */}
      {isInstallment ? (
        <div className={styles.installmentContainer}>
          <div className={styles.grid2Col}>
            <div className={styles.fieldGroup}>
              <Dropdown
                id="installmentCount"
                label="Number of Installments"
                value={String(formData.installmentCount)}
                onChange={(val) => onFieldChange("installmentCount", Number(val))}
                options={INSTALLMENT_COUNT_OPTIONS}
                fullWidth
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="firstPaymentAmount" className={styles.fieldLabel}>
                First Payment (Admission Fee) ৳
              </label>
              <input
                id="firstPaymentAmount"
                type="number"
                min={0}
                max={netFee}
                value={formData.firstPaymentAmount || ""}
                onChange={(e) => onFieldChange("firstPaymentAmount", Number(e.target.value) || 0)}
                placeholder={`Default: ${formatBDT(Math.round(netFee / formData.installmentCount))}`}
                className={styles.inputField}
              />
            </div>
          </div>

          {/* Schedule Table Component */}
          <InstallmentScheduleTable installments={installments} />
        </div>
      ) : null}

      {/* Financial Summary Strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Base Fee:</span>
          <span className={styles.summaryValue}>{formatBDT(baseFee)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Discount:</span>
          <span className={styles.summaryValueDiscount}>
            {discountAmount > 0 ? `-${formatBDT(discountAmount)}` : "৳ 0"}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Net Payable Fee:</span>
          <span className={styles.summaryValueNet}>{formatBDT(netFee)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Paid Today:</span>
          <span className={styles.summaryValuePaid}>
            {formatBDT(isInstallment ? installments[0]?.amount || 0 : netFee)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Remaining Due:</span>
          <span className={styles.summaryValueDue}>
            {formatBDT(isInstallment ? Math.max(0, netFee - (installments[0]?.amount || 0)) : 0)}
          </span>
        </div>
      </div>
    </section>
  );
}
