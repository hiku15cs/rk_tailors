import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DesignCategory = "Blouse" | "Kurti" | "Suit" | "Gents";

export type Design = {
  id: string;
  created_at: string;
  title: string;
  category: DesignCategory;
  starting_price: number;
  image_url: string;
  tags: string[];
  is_active: boolean;
};

export type OrderStatus =
  | "Received"
  | "Cutting"
  | "Stitching"
  | "Ready for Trial"
  | "Delivered";

export type Order = {
  id: string;
  order_no: string;
  customer_name: string;
  customer_phone: string;
  garment_type: string;
  status: OrderStatus;
  trial_date: string | null;
  total_amount: number | null;
  created_at: string;
};

type TableDefinition<
  Row extends Record<string, unknown>,
  Insert extends Record<string, unknown>,
  Update extends Record<string, unknown>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      designs: TableDefinition<
        Design,
        Omit<Design, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        },
        Partial<Omit<Design, "id" | "created_at">>
      >;
      orders: TableDefinition<
        Order,
        Omit<Order, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        },
        Partial<Omit<Order, "id" | "created_at">>
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      lookup_order: {
        Args: { p_order_no: string; p_customer_phone: string };
        Returns: Array<
          Pick<
            Order,
            | "order_no"
            | "garment_type"
            | "status"
            | "trial_date"
            | "total_amount"
            | "created_at"
          >
        >;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

let client: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const missingVariables = [
      !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
      !supabaseKey
        ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : null,
    ].filter((variable): variable is string => variable !== null);
    throw new Error(`Missing Supabase environment variable(s): ${missingVariables.join(", ")}.`);
  }

  client = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export const orderStatuses: OrderStatus[] = [
  "Received",
  "Cutting",
  "Stitching",
  "Ready for Trial",
  "Delivered",
];

export const designCategories: DesignCategory[] = [
  "Blouse",
  "Kurti",
  "Suit",
  "Gents",
];
