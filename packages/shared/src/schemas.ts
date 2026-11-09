import { z } from 'zod';
import { SHOW_DAYS } from './show';

/* ---------- Media ---------- */

export const ImageSchema = z.object({
  /** Path relative to the API origin, e.g. `/api/art/garden-moonlit-meadow` */
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Dominant colour, used as a placeholder while the image loads */
  dominant: z.string(),
});
export type Image = z.infer<typeof ImageSchema>;

/* ---------- Exhibits / gardens ---------- */

export const ExhibitSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  designer: z.string(),
  tagline: z.string(),
  description: z.array(z.string()),
  highlights: z.array(z.string()),
  zone: z.string(),
  bloomSeason: z.enum(['spring', 'summer', 'autumn']),
  image: ImageSchema,
  featured: z.boolean(),
});
export type Exhibit = z.infer<typeof ExhibitSchema>;
export const ExhibitListSchema = z.array(ExhibitSchema);

/* ---------- Schedule ---------- */

export const EventCategorySchema = z.enum(['ceremony', 'talk', 'workshop', 'tour', 'performance']);
export type EventCategory = z.infer<typeof EventCategorySchema>;

export const ShowDaySchema = z.enum(SHOW_DAYS);

export const EventItemSchema = z.object({
  id: z.string(),
  day: ShowDaySchema,
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  category: EventCategorySchema,
  host: z.string().optional(),
});
export type EventItem = z.infer<typeof EventItemSchema>;
export const EventListSchema = z.array(EventItemSchema);

/* ---------- Gallery ---------- */

export const GalleryItemSchema = z.object({
  id: z.string(),
  image: ImageSchema,
  caption: z.string(),
  credit: z.string(),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export const GalleryListSchema = z.array(GalleryItemSchema);

/* ---------- Tickets ---------- */

export const TicketTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  /** Price in minor units (paise for INR) */
  price: z.number().int().nonnegative(),
  currency: z.string().length(3),
  perks: z.array(z.string()),
  highlight: z.boolean(),
  maxPerOrder: z.number().int().positive(),
});
export type TicketType = z.infer<typeof TicketTypeSchema>;
export const TicketTypeListSchema = z.array(TicketTypeSchema);

export const OrderLineSchema = z.object({
  ticketTypeId: z.string(),
  quantity: z.number().int().min(0).max(10),
});

export const OrderRequestSchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your full name').max(80),
    email: z.string().trim().email('Please enter a valid email address'),
    visitDate: ShowDaySchema,
    items: z.array(OrderLineSchema).min(1),
  })
  .refine((o) => o.items.some((i) => i.quantity > 0), {
    message: 'Choose at least one ticket',
    path: ['items'],
  });
export type OrderRequest = z.infer<typeof OrderRequestSchema>;

export const OrderConfirmationSchema = z.object({
  orderId: z.string(),
  name: z.string(),
  email: z.string(),
  visitDate: ShowDaySchema,
  lines: z.array(
    z.object({
      ticketTypeId: z.string(),
      name: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number().int(),
      subtotal: z.number().int(),
    }),
  ),
  total: z.number().int(),
  currency: z.string(),
  createdAt: z.string(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

/* ---------- Newsletter ---------- */

export const NewsletterRequestSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  firstName: z.string().trim().max(60).optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please agree to receive emails from us' }),
  }),
});
export type NewsletterRequest = z.infer<typeof NewsletterRequestSchema>;

export const NewsletterResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});
export type NewsletterResponse = z.infer<typeof NewsletterResponseSchema>;

/* ---------- Errors ---------- */

export const ApiErrorSchema = z.object({
  error: z.string(),
  issues: z.record(z.array(z.string())).optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
