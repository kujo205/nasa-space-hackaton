import Zod, { ZodIssueCode } from "zod";

const leadTimeSchema = Zod.coerce.number().int().min(1).max(8);
const dateSchema = Zod.date().optional();

export const tabs = ["acquisition", "historic"] as const;
export const formSchema = Zod.object({
  email: Zod.string().email(),
  latitude: Zod.coerce.number().min(-90).max(90),
  longitude: Zod.coerce.number().min(-180).max(180),
  lead_time: Zod.number().min(1).max(8).or(Zod.string()).optional().default(1),
  max_cloud_cover: Zod.coerce.number().int().min(0).max(100).default(99),
  span_end_time: dateSchema,
  span_start_time: dateSchema,
  type: Zod.enum(tabs),
  expected_pass_time: dateSchema,
}).superRefine((data, ctx) => {
  if (data.type === "historic") {
    if (data.span_start_time === undefined) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Start time is required for historic type",
        path: ["span_start_time"],
      });
    }
    if (data.span_end_time === undefined) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "End time is required for historic type",
        path: ["span_end_time"],
      });
    }
    // Validation for historic type
  }
});
export type TFormSchema = Zod.infer<typeof formSchema>;
