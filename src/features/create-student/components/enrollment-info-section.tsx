/**
 * @fileoverview Enrollment Info Section Component
 * @module features/create-student/components/enrollment-info-section
 */

"use client";

import clsx from "clsx";
import { AlertCircle, Calendar, CheckCircle2, Users } from "lucide-react";
import type {
  AvailableBatch,
  AvailableCourse,
  CreateStudentFormData,
  CreateStudentFormErrors,
  StudentStatus,
} from "../types";
import { STUDENT_BRANCH_OPTIONS } from "../services";
import styles from "../styles/enrollment-info-section.module.css";

interface EnrollmentInfoSectionProps {
  formData: CreateStudentFormData;
  errors: CreateStudentFormErrors;
  availableCourses: AvailableCourse[];
  selectedCourse: AvailableCourse | undefined;
  availableBatches: AvailableBatch[];
  onFieldChange: <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => void;
  onBranchChange: (branchId: string) => void;
  onCourseChange: (courseId: string) => void;
}

const STATUS_OPTIONS: StudentStatus[] = [
  "ACTIVE",
  "ON-GOING",
  "COMPLETED",
  "IN-ACTIVE",
];

export function EnrollmentInfoSection({
  formData,
  errors,
  availableCourses,
  selectedCourse,
  availableBatches,
  onFieldChange,
  onBranchChange,
  onCourseChange,
}: EnrollmentInfoSectionProps) {
  const selectedBatch = availableBatches.find((b) => b.id === formData.batchId);
  const remainingSeats = selectedBatch
    ? selectedBatch.totalSeats - selectedBatch.filledSeats
    : 0;

  return (
    <section className={styles.section} aria-labelledby="section-enrollment-info">
      <div className={styles.sectionHeader}>
        <h2 id="section-enrollment-info" className={styles.sectionTitle}>
          Enrollment & Academy Allocation
        </h2>
        <p className={styles.sectionSubtitle}>
          Assign branch campus, program course, active batch, and enrollment progression status.
        </p>
      </div>

      <div className={styles.grid3Col}>
        {/* Branch Selection */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="branchId"
            className={clsx(styles.fieldLabel, errors.branchId && styles.fieldLabelInvalid)}
          >
            Branch Campus <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            id="branchId"
            value={formData.branchId}
            onChange={(e) => onBranchChange(e.target.value)}
            className={clsx(styles.selectField, errors.branchId && styles.inputInvalid)}
          >
            {STUDENT_BRANCH_OPTIONS.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branchId ? <span className={styles.fieldError}>{errors.branchId}</span> : null}
        </div>

        {/* Course Selection */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="courseId"
            className={clsx(styles.fieldLabel, errors.courseId && styles.fieldLabelInvalid)}
          >
            Program / Course <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            id="courseId"
            value={formData.courseId}
            onChange={(e) => onCourseChange(e.target.value)}
            className={clsx(styles.selectField, errors.courseId && styles.inputInvalid)}
          >
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.duration})
              </option>
            ))}
          </select>
          {errors.courseId ? <span className={styles.fieldError}>{errors.courseId}</span> : null}
          {selectedCourse ? (
            <span className={styles.courseHint}>
              Duration: {selectedCourse.duration} • Base Fee: ৳ {selectedCourse.baseFee.toLocaleString("en-BD")}
            </span>
          ) : null}
        </div>

        {/* Batch Selection */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="batchId"
            className={clsx(styles.fieldLabel, errors.batchId && styles.fieldLabelInvalid)}
          >
            Batch & Shift <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            id="batchId"
            value={formData.batchId}
            onChange={(e) => onFieldChange("batchId", e.target.value)}
            className={clsx(styles.selectField, errors.batchId && styles.inputInvalid)}
          >
            {availableBatches.map((batch) => {
              const seatsLeft = batch.totalSeats - batch.filledSeats;
              return (
                <option key={batch.id} value={batch.id}>
                  {batch.name} — {seatsLeft > 0 ? `${seatsLeft} seats left` : "Full"}
                </option>
              );
            })}
          </select>
          {errors.batchId ? <span className={styles.fieldError}>{errors.batchId}</span> : null}
        </div>
      </div>

      {/* Dynamic Batch Seat Availability Banner */}
      {selectedBatch ? (
        <div className={styles.batchInfoBanner}>
          <div className={styles.bannerSchedule}>
            <Calendar size={15} className={styles.bannerIcon} />
            <span>Schedule: <strong>{selectedBatch.schedule}</strong></span>
          </div>

          <div className={styles.bannerSeats}>
            <Users size={15} className={styles.bannerIcon} />
            <span>
              Capacity: <strong>{selectedBatch.filledSeats} / {selectedBatch.totalSeats}</strong> seats filled
            </span>
            {remainingSeats <= 2 ? (
              <span className={styles.seatAlertLow}>
                <AlertCircle size={12} /> {remainingSeats} seat{remainingSeats === 1 ? "" : "s"} left!
              </span>
            ) : (
              <span className={styles.seatAlertGood}>
                <CheckCircle2 size={12} /> {remainingSeats} seats available
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className={styles.grid2Col}>
        {/* Enrollment Date */}
        <div className={styles.fieldGroup}>
          <label htmlFor="enrollmentDate" className={styles.fieldLabel}>
            Enrollment Date <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => onFieldChange("enrollmentDate", e.target.value)}
            className={styles.inputField}
          />
        </div>

        {/* Student Status */}
        <div className={styles.fieldGroup}>
          <label htmlFor="status" className={styles.fieldLabel}>
            Student Progression Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => onFieldChange("status", e.target.value as StudentStatus)}
            className={styles.selectField}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
