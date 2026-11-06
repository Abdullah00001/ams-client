/**
 * @fileoverview Enrollment Info Section Component
 * @module features/create-student/components/enrollment-info-section
 */

"use client";

import { AlertCircle, Calendar, CheckCircle2, Users } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
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
          <Dropdown
            id="branchId"
            label={<>Branch Campus <span className={styles.requiredAsterisk}>*</span></>}
            value={formData.branchId}
            onChange={onBranchChange}
            invalid={Boolean(errors.branchId)}
            errorMessage={errors.branchId}
            options={STUDENT_BRANCH_OPTIONS.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            fullWidth
          />
        </div>

        {/* Course Selection */}
        <div className={styles.fieldGroup}>
          <Dropdown
            id="courseId"
            label={<>Program / Course <span className={styles.requiredAsterisk}>*</span></>}
            value={formData.courseId}
            onChange={onCourseChange}
            invalid={Boolean(errors.courseId)}
            errorMessage={errors.courseId}
            options={availableCourses.map((course) => ({
              value: course.id,
              label: `${course.name} (${course.duration})`,
            }))}
            fullWidth
            helperText={
              selectedCourse
                ? `Duration: ${selectedCourse.duration} • Base Fee: ৳ ${selectedCourse.baseFee.toLocaleString("en-BD")}`
                : undefined
            }
          />
        </div>

        {/* Batch Selection */}
        <div className={styles.fieldGroup}>
          <Dropdown
            id="batchId"
            label={<>Batch & Shift <span className={styles.requiredAsterisk}>*</span></>}
            value={formData.batchId}
            onChange={(val) => onFieldChange("batchId", val)}
            invalid={Boolean(errors.batchId)}
            errorMessage={errors.batchId}
            options={availableBatches.map((batch) => {
              const seatsLeft = batch.totalSeats - batch.filledSeats;
              return {
                value: batch.id,
                label: `${batch.name} — ${seatsLeft > 0 ? `${seatsLeft} seats left` : "Full"}`,
                disabled: seatsLeft === 0,
              };
            })}
            fullWidth
          />
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
          <Dropdown
            id="status"
            label="Student Progression Status"
            value={formData.status}
            onChange={(val) => onFieldChange("status", val as StudentStatus)}
            options={STATUS_OPTIONS.map((status) => ({
              value: status,
              label: status,
            }))}
            fullWidth
          />
        </div>
      </div>
    </section>
  );
}
