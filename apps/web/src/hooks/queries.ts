import { useMutation, useQuery } from '@tanstack/react-query';
import {
  EventListSchema,
  ExhibitListSchema,
  ExhibitSchema,
  GalleryListSchema,
  NewsletterResponseSchema,
  OrderConfirmationSchema,
  TicketTypeListSchema,
  type NewsletterRequest,
  type OrderRequest,
} from '@flower/shared';
import { getJson, postJson } from '@/lib/api';

export const qk = {
  exhibits: ['exhibits'] as const,
  exhibit: (slug: string) => ['exhibits', slug] as const,
  events: ['events'] as const,
  gallery: ['gallery'] as const,
  tickets: ['tickets'] as const,
};

export const useExhibits = () =>
  useQuery({ queryKey: qk.exhibits, queryFn: ({ signal }) => getJson('/api/exhibits?featured=true', ExhibitListSchema, signal) });

export const useExhibit = (slug: string) =>
  useQuery({ queryKey: qk.exhibit(slug), queryFn: ({ signal }) => getJson(`/api/exhibits/${encodeURIComponent(slug)}`, ExhibitSchema, signal) });

export const useEvents = () => useQuery({ queryKey: qk.events, queryFn: ({ signal }) => getJson('/api/events', EventListSchema, signal) });

export const useGallery = () => useQuery({ queryKey: qk.gallery, queryFn: ({ signal }) => getJson('/api/gallery', GalleryListSchema, signal) });

export const useTicketTypes = () =>
  useQuery({ queryKey: qk.tickets, queryFn: ({ signal }) => getJson('/api/tickets', TicketTypeListSchema, signal) });

export const useNewsletterSignup = () =>
  useMutation({ mutationFn: (body: NewsletterRequest) => postJson('/api/newsletter', body, NewsletterResponseSchema) });

export const useCreateOrder = () => useMutation({ mutationFn: (body: OrderRequest) => postJson('/api/orders', body, OrderConfirmationSchema) });
