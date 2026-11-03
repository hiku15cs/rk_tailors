"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { LogOut, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import {
  designCategories,
  orderStatuses,
  getSupabaseClient,
  type Design,
  type DesignCategory,
  type Order,
  type OrderStatus,
} from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

function extractStoragePath(imageUrl: string): string | null {
  const marker = "/storage/v1/object/public/design-images/";
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  try {
    return decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-warm-gray/70 focus:border-forest focus:ring-2 focus:ring-forest/10";

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardError, setDashboardError] = useState("");
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );
  const [busyAction, setBusyAction] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DesignCategory>("Blouse");
  const [startingPrice, setStartingPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [orderNo, setOrderNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    try {
      const supabase = getSupabaseClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (active) {
          setSession(nextSession);
          setAuthLoading(false);
          setNotice(null);
        }
      });
      unsubscribe = () => subscription.unsubscribe();

      void supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (!active) return;
          if (error) {
            setNotice({ kind: "error", text: error.message });
          } else {
            setSession(data.session);
          }
          setAuthLoading(false);
        })
        .catch((error: unknown) => {
          if (!active) return;
          setNotice({ kind: "error", text: getErrorMessage(error) });
          setAuthLoading(false);
        });
    } catch (error) {
      setNotice({ kind: "error", text: getErrorMessage(error) });
      setAuthLoading(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const supabase = getSupabaseClient();
      const [designResult, orderResult] = await Promise.all([
        supabase
          .from("designs")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (designResult.error || orderResult.error) {
        setDashboardError(
          [designResult.error?.message, orderResult.error?.message]
            .filter((message): message is string => Boolean(message))
            .join(" "),
        );
      } else {
        setDesigns(designResult.data ?? []);
        setOrders(orderResult.data ?? []);
      }
    } catch (error) {
      setDashboardError(getErrorMessage(error));
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      setDesigns([]);
      setOrders([]);
      setDashboardError("");
      return;
    }
    void loadDashboard();
  }, [loadDashboard, session]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setNotice(null);
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) setNotice({ kind: "error", text: error.message });
    } catch (error) {
      setNotice({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    setBusyAction("logout");
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) setNotice({ kind: "error", text: error.message });
    } catch (error) {
      setNotice({ kind: "error", text: getErrorMessage(error) });
    } finally {
      setBusyAction("");
    }
  }

  async function handleDesignUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setNotice(null);

    if (!imageFile) {
      setNotice({ kind: "error", text: "Choose an image to upload." });
      return;
    }
    if (!(imageFile.type in imageExtensions)) {
      setNotice({
        kind: "error",
        text: "Use a JPEG, PNG, WebP, or GIF image.",
      });
      return;
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      setNotice({ kind: "error", text: "Images must be 10 MB or smaller." });
      return;
    }

    const price = Number(startingPrice);
    if (!Number.isFinite(price) || price < 0) {
      setNotice({ kind: "error", text: "Enter a valid non-negative starting price." });
      return;
    }

    setBusyAction("upload");
    try {
      const supabase = getSupabaseClient();
      const storagePath = `${crypto.randomUUID()}.${imageExtensions[imageFile.type]}`;
      const { error: uploadError } = await supabase.storage
        .from("design-images")
        .upload(storagePath, imageFile, {
          cacheControl: "3600",
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        setNotice({ kind: "error", text: `Image upload failed: ${uploadError.message}` });
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("design-images")
        .getPublicUrl(storagePath);
      const { data: insertedDesign, error: insertError } = await supabase
        .from("designs")
        .insert({
          title: title.trim(),
          category,
          starting_price: price,
          image_url: publicUrl.publicUrl,
          tags: [],
          is_active: true,
        })
        .select("*")
        .single();

      if (insertError) {
        const { error: cleanupError } = await supabase.storage
          .from("design-images")
          .remove([storagePath]);
        setNotice({
          kind: "error",
          text: cleanupError
            ? `Design save failed: ${insertError.message} Image cleanup also failed: ${cleanupError.message}`
            : `Design save failed: ${insertError.message}`,
        });
        return;
      }

      setDesigns((current) => [insertedDesign, ...current]);
      setTitle("");
      setCategory("Blouse");
      setStartingPrice("");
      setImageFile(null);
      form.reset();
      setNotice({ kind: "success", text: "Design uploaded and published." });
    } catch (error) {
      setNotice({ kind: "error", text: `Design upload failed: ${getErrorMessage(error)}` });
    } finally {
      setBusyAction("");
    }
  }

  async function updateDesign(
    designId: string,
    patch: { is_active: boolean } | { starting_price: number },
    action: string,
  ) {
    setBusyAction(action);
    setNotice(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("designs")
        .update(patch)
        .eq("id", designId)
        .select("*")
        .single();

      if (error) {
        setNotice({ kind: "error", text: `Design update failed: ${error.message}` });
      } else {
        setDesigns((current) => current.map((design) => (design.id === designId ? data : design)));
        setNotice({ kind: "success", text: "Design updated." });
      }
    } catch (error) {
      setNotice({ kind: "error", text: `Design update failed: ${getErrorMessage(error)}` });
    } finally {
      setBusyAction("");
    }
  }

  async function handleDeleteDesign(design: Design) {
    if (!window.confirm(`Delete "${design.title}" from the catalog?`)) return;

    setBusyAction(`delete-${design.id}`);
    setNotice(null);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("designs").delete().eq("id", design.id);

      if (error) {
        setNotice({ kind: "error", text: `Design delete failed: ${error.message}` });
        return;
      }

      setDesigns((current) => current.filter((item) => item.id !== design.id));
      const storagePath = extractStoragePath(design.image_url);
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from("design-images")
          .remove([storagePath]);
        if (storageError) {
          setNotice({
            kind: "error",
            text: `Design was deleted, but its storage image could not be removed: ${storageError.message}`,
          });
          return;
        }
      }

      setNotice({ kind: "success", text: "Design deleted." });
    } catch (error) {
      setNotice({ kind: "error", text: `Design delete failed: ${getErrorMessage(error)}` });
    } finally {
      setBusyAction("");
    }
  }

  async function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const amount = totalAmount.trim() === "" ? null : Number(totalAmount);
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      setNotice({ kind: "error", text: "Enter a valid non-negative order total." });
      return;
    }

    setBusyAction("order-create");
    setNotice(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("orders")
        .insert({
          order_no: orderNo.trim(),
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          garment_type: garmentType.trim(),
          trial_date: trialDate || null,
          total_amount: amount,
          status: "Received",
        })
        .select("*")
        .single();

      if (error) {
        setNotice({ kind: "error", text: `Order creation failed: ${error.message}` });
      } else {
        setOrders((current) => [data, ...current]);
        setOrderNo("");
        setCustomerName("");
        setCustomerPhone("");
        setGarmentType("");
        setTrialDate("");
        setTotalAmount("");
        form.reset();
        setNotice({ kind: "success", text: `Order ${data.order_no} created.` });
      }
    } catch (error) {
      setNotice({ kind: "error", text: `Order creation failed: ${getErrorMessage(error)}` });
    } finally {
      setBusyAction("");
    }
  }

  async function handleOrderStatus(orderId: string, status: OrderStatus) {
    setBusyAction(`status-${orderId}`);
    setNotice(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select("*")
        .single();

      if (error) {
        setNotice({ kind: "error", text: `Order status update failed: ${error.message}` });
      } else {
        setOrders((current) => current.map((order) => (order.id === orderId ? data : order)));
        setNotice({ kind: "success", text: `Order ${data.order_no} updated.` });
      }
    } catch (error) {
      setNotice({ kind: "error", text: `Order status update failed: ${getErrorMessage(error)}` });
    } finally {
      setBusyAction("");
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5">
        <p role="status" className="text-sm text-warm-gray">Checking admin session…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12">
        <div className="w-full max-w-md rounded-3xl border border-ink/5 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            RK Tailor
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">Admin Panel</h1>
          <p className="mt-2 text-sm text-warm-gray">Sign in to manage designs and orders.</p>

          {notice && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              {notice.text}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-ink">
              Email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              disabled={loginLoading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-forest-dark disabled:cursor-wait disabled:opacity-60"
            >
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">
              RK Tailor
            </p>
            <h1 className="font-display text-xl text-ink sm:text-2xl">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs text-warm-gray sm:inline">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={busyAction === "logout"}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-xs font-semibold text-ink transition hover:border-forest hover:text-forest disabled:opacity-60"
            >
              <LogOut size={15} aria-hidden="true" />
              {busyAction === "logout" ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-7 sm:px-8 sm:py-10">
        {notice && (
          <p
            role={notice.kind === "error" ? "alert" : "status"}
            className={`rounded-xl p-4 text-sm ${
              notice.kind === "error"
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {notice.text}
          </p>
        )}

        <section className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="font-display text-2xl text-ink">Upload a design</h2>
            <p className="mt-1 text-sm text-warm-gray">
              Add a design and publish it to the public collection.
            </p>
          </div>
          <form onSubmit={handleDesignUpload} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium text-ink">
              Title
              <input
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as DesignCategory)}
                className={inputClass}
              >
                {designCategories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-ink">
              Starting price (₹)
              <input
                type="number"
                min="0"
                step="1"
                required
                value={startingPrice}
                onChange={(event) => setStartingPrice(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Image (max 10 MB)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-sage file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-forest`}
              />
            </label>
            <button
              type="submit"
              disabled={busyAction === "upload"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-forest-dark disabled:cursor-wait disabled:opacity-60 sm:col-span-2 lg:col-span-4 lg:justify-self-start"
            >
              <Upload size={16} aria-hidden="true" />
              {busyAction === "upload" ? "Uploading design…" : "Upload and publish"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-ink">Manage designs</h2>
              <p className="mt-1 text-sm text-warm-gray">
                Hide, reprice, or remove a design from the collection.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={dashboardLoading}
              aria-label="Refresh dashboard data"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-xs font-semibold text-ink hover:border-forest hover:text-forest disabled:opacity-60"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Refresh
            </button>
          </div>
          {dashboardError && (
            <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              Could not load dashboard data: {dashboardError}
            </p>
          )}
          {dashboardLoading ? (
            <p role="status" className="py-8 text-center text-sm text-warm-gray">
              Loading designs and orders…
            </p>
          ) : designs.length === 0 ? (
            <p className="py-8 text-center text-sm text-warm-gray">No designs yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {designs.map((design) => {
                const priceValue = priceDrafts[design.id] ?? String(design.starting_price);
                const parsedPrice = Number(priceValue);
                const priceChanged = parsedPrice !== design.starting_price;
                const priceIsValid =
                  priceValue.trim() !== "" &&
                  Number.isFinite(parsedPrice) &&
                  parsedPrice >= 0;

                return (
                  <article
                    key={design.id}
                    className="overflow-hidden rounded-2xl border border-ink/10"
                  >
                    <div className="relative aspect-[16/10] bg-sage">
                      <img
                        src={design.image_url}
                        alt={design.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-forest">
                        {design.category}
                      </span>
                    </div>
                    <div className="space-y-4 p-4">
                      <h3 className="font-semibold text-ink">{design.title}</h3>
                      <div className="flex flex-wrap items-end gap-2">
                        <label className="min-w-32 flex-1 text-xs font-medium text-warm-gray">
                          Starting price (₹)
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={priceValue}
                            onChange={(event) =>
                              setPriceDrafts((current) => ({
                                ...current,
                                [design.id]: event.target.value,
                              }))
                            }
                            className={inputClass}
                          />
                        </label>
                        <button
                          type="button"
                          disabled={
                            !priceChanged ||
                            !priceIsValid ||
                            busyAction === `price-${design.id}`
                          }
                          onClick={() =>
                            void updateDesign(
                              design.id,
                              { starting_price: parsedPrice },
                              `price-${design.id}`,
                            )
                          }
                          className="min-h-11 rounded-xl border border-forest/20 px-3 text-xs font-semibold text-forest hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busyAction === `price-${design.id}` ? "Saving…" : "Save price"}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/5 pt-3">
                        <button
                          type="button"
                          aria-pressed={design.is_active}
                          disabled={busyAction === `active-${design.id}`}
                          onClick={() =>
                            void updateDesign(
                              design.id,
                              { is_active: !design.is_active },
                              `active-${design.id}`,
                            )
                          }
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                            design.is_active
                              ? "bg-green-50 text-green-800"
                              : "bg-ink/5 text-warm-gray"
                          }`}
                        >
                          {busyAction === `active-${design.id}`
                            ? "Saving…"
                            : design.is_active
                              ? "Active · click to hide"
                              : "Hidden · click to show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteDesign(design)}
                          disabled={busyAction === `delete-${design.id}`}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          {busyAction === `delete-${design.id}` ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="font-display text-2xl text-ink">Order management</h2>
            <p className="mt-1 text-sm text-warm-gray">
              Create customer orders and update their stitching status.
            </p>
          </div>
          <form onSubmit={handleCreateOrder} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-medium text-ink">
              Order number
              <input required value={orderNo} onChange={(event) => setOrderNo(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-ink">
              Customer name
              <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-ink">
              Phone
              <input type="tel" required value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-ink">
              Garment
              <input required value={garmentType} onChange={(event) => setGarmentType(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-ink">
              Trial date
              <input type="date" value={trialDate} onChange={(event) => setTrialDate(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-medium text-ink">
              Total amount (₹)
              <input type="number" min="0" step="0.01" value={totalAmount} onChange={(event) => setTotalAmount(event.target.value)} className={inputClass} />
            </label>
            <button
              type="submit"
              disabled={busyAction === "order-create"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-forest-dark disabled:opacity-60 sm:col-span-2 lg:col-span-3 lg:justify-self-start"
            >
              <Plus size={16} aria-hidden="true" />
              {busyAction === "order-create" ? "Creating order…" : "Create order"}
            </button>
          </form>

          <div className="mt-8 border-t border-ink/10 pt-6">
            <h3 className="font-display text-xl text-ink">Recent orders</h3>
            {orders.length === 0 ? (
              <p className="py-8 text-sm text-warm-gray">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="grid gap-3 rounded-xl border border-ink/10 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-ink">
                        {order.order_no} · {order.customer_name}
                      </p>
                      <p className="mt-1 text-xs text-warm-gray">
                        {order.customer_phone} · {order.garment_type}
                        {order.trial_date ? ` · Trial ${order.trial_date}` : ""}
                        {order.total_amount !== null
                          ? ` · ₹${order.total_amount.toLocaleString("en-IN")}`
                          : ""}
                      </p>
                    </div>
                    <label className="text-xs font-medium text-warm-gray">
                      Order status
                      <select
                        value={order.status}
                        disabled={busyAction === `status-${order.id}`}
                        onChange={(event) =>
                          void handleOrderStatus(order.id, event.target.value as OrderStatus)
                        }
                        className={`${inputClass} mt-1 min-w-44`}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
