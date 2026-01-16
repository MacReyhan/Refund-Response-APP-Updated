# Implement SLA-Based Response System

## Overview

Replace hardcoded "2-4 hours" timeframe with a dynamic SLA (Service Level Agreement) input field. This will allow users to specify custom SLA timeframes for refund completion across all payment modes.

## User Review Required

> [!IMPORTANT]
> **Breaking Change**: The status dropdown labels will change from:
> - "Completed (within 2-4 hours)" → "Completed (within SLA)"
> - "Completed (post 2-4 hours)" → "Completed (post SLA)"
> 
> This affects the UI display but maintains backward compatibility in the logic.

## Proposed Changes

### Type Definitions

#### [MODIFY] [types.ts](file:///d:/Github/GitHub/Refund-Response-APP/types.ts)

1. **Update RefundStatus enum** (lines 14-18):
   - Change `CompletedWithin` label from "Completed (within 2-4 hours)" to "Completed (within SLA)"
   - Change `CompletedPost` label from "Completed (post 2-4 hours)" to "Completed (post SLA)"

2. **Add SLA field to FormData interface** (lines 20-27):
   - Add `sla?: string` field to store the SLA timeframe (e.g., "2-4 hours", "24 hours", "5-7 business days")

---

### Business Logic

#### [MODIFY] [responseLogic.ts](file:///d:/Github/GitHub/Refund-Response-APP/utils/responseLogic.ts)

1. **Update Processing status logic** (lines 49-54):
   - Replace hardcoded "2-4 hours" with dynamic `sla` value
   - Line 51: Change `Usually refund should be completed or update will be shared within 2-4 hours.` to use `${sla || '2-4 hours'}`

2. **Update CompletedWithin status logic** (lines 56-105):
   - Replace all instances of "in the next 2-4 hours" with "within ${sla || '2-4 hours'}"
   - Affects lines: 63, 68, 73, 78, 83, 88

3. **Update CompletedPost status logic** (lines 107-132):
   - No changes needed as this section doesn't reference the timeframe

---

### User Interface

#### [MODIFY] [App.tsx](file:///d:/Github/GitHub/Refund-Response-APP/App.tsx)

1. **Update initial form state** (lines 14-21):
   - Add `sla: ''` to the initial `formData` state

2. **Update handleReset function** (lines 56-66):
   - Add `sla: ''` to the reset object

3. **Add SLA input field in the form** (after line 214, before Mode Select):
   - Add a new input field for SLA with label "SLA Timeframe"
   - Placeholder: "e.g., 2-4 hours, 24 hours, 5-7 business days"
   - Position it as a full-width field (md:col-span-2)
   - Style consistently with other input fields

## Verification Plan

### Manual Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Processing Status**:
   - Fill in amount: `500`
   - Fill in SLA: `24 hours`
   - Select Status: `Processing`
   - Click "Generate Response"
   - **Expected**: Message should say "Usually refund should be completed or update will be shared within 24 hours"

3. **Test Completed (within SLA) - Credit Card**:
   - Fill in amount: `1000`
   - Fill in SLA: `5-7 business days`
   - Select Mode: `Credit Card`
   - Select Status: `Completed (within SLA)`
   - Click "Generate Response"
   - **Expected**: Message should say "will be refunded to your Credit Card within 5-7 business days"

4. **Test Completed (within SLA) - UPI with RRN**:
   - Fill in amount: `750`
   - Fill in RRN: `123456789`
   - Fill in SLA: `2-4 hours`
   - Select Mode: `UPI`
   - Select Status: `Completed (within SLA)`
   - Click "Generate Response"
   - **Expected**: Message should say "will be refunded to your UPI within 2-4 hours with your bank reference number 123456789"

5. **Test Default SLA (empty field)**:
   - Fill in amount: `300`
   - Leave SLA field empty
   - Select Status: `Processing`
   - Click "Generate Response"
   - **Expected**: Should default to "2-4 hours" if SLA is not provided

6. **Test all payment modes** with both "within SLA" and "post SLA" statuses to ensure consistency
