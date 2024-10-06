import Zod, { ZodIssueCode } from "zod";

const leadTimeSchema = Zod.coerce.number().int().min(1).max(8);
const dateSchema = Zod.date().optional();

export const tabs = ["acquisition", "historic"] as const;
export const formSchema = Zod.object({
  email: Zod.string().email(),
  latitude: Zod.coerce.number().min(-90).max(90),
  longitude: Zod.coerce.number().min(-180).max(180),
  lead_time: leadTimeSchema.optional(),
  max_cloud_cover: Zod.coerce.number().int().min(0).max(100).default(99),
  span_end_time: dateSchema,
  span_start_time: dateSchema,
  type: Zod.enum(tabs),
}).superRefine((data, ctx) => {
  if (data.type === "acquisition") {
    const res = leadTimeSchema.safeParse(data.lead_time);
    if (!res.success) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: res.error.message,
        path: ["lead_time"],
      });
    }
  } else {
    const start = dateSchema.safeParse(data.span_start_time);
    const end = dateSchema.safeParse(data.span_end_time);
    if (!start.success) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: start.error.message,
        path: ["span_start_time"],
      });
    }
    if (!end.success) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: end.error.message,
        path: ["span_end_time"],
      });
    }
  }
});
export type TFormSchema = Zod.infer<typeof formSchema>;
