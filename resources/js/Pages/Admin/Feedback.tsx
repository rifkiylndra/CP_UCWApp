import React, { FormEvent, useMemo, useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import { formatPaginationLabel } from "@/lib/pagination";
import type { AdminUser } from "@/types/admin";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";

interface FeedbackOrderItem {
  name: string;
  quantity: number;
  note?: string | null;
  subtotal: number;
}

interface FeedbackOrder {
  id: number;
  order_ref: string;
  customer_name: string;
  order_type?: string | null;
  order_status?: string | null;
  payment_status?: string | null;
  table_number?: string | null;
  total_price: number;
  items: FeedbackOrderItem[];
  menu_summary?: string;
}

interface FeedbackItem {
  id: number;
  rating?: number | null;
  comment?: string | null;
  sentiment_label?: "positive" | "neutral" | "negative" | null;
  created_at?: string | null;
  order?: FeedbackOrder | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedFeedback {
  data: FeedbackItem[];
  links?: PaginationLink[];
  from?: number;
  to?: number;
  total?: number;
}

interface FeedbackSummary {
  total: number;
  average_rating: number;
  positive: number;
  neutral: number;
  negative: number;
  rating_counts: Record<string, number>;
}

interface FeedbackFilters {
  rating?: string | number;
  sentiment?: string;
  search?: string;
}

interface FeedbackProps {
  auth: { user: AdminUser };
  feedbacks?: PaginatedFeedback;
  summary?: FeedbackSummary;
  filters?: FeedbackFilters;
}

export default function Feedback({
  auth,
  feedbacks,
  summary,
  filters,
}: FeedbackProps) {
  const [search, setSearch] = useState(String(filters?.search || ""));
  const [rating, setRating] = useState(String(filters?.rating || ""));
  const [sentiment, setSentiment] = useState(String(filters?.sentiment || ""));

  const activeFilters = useMemo(
    () => ({
      search: search.trim() || undefined,
      rating: rating || undefined,
      sentiment: sentiment || undefined,
    }),
    [rating, search, sentiment]
  );

  const applyFilters = (event?: FormEvent) => {
    event?.preventDefault();

    router.get(route("admin.feedback" as any), activeFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setRating("");
    setSentiment("");

    router.get(
      route("admin.feedback" as any),
      {},
      {
        preserveScroll: true,
        replace: true,
      }
    );
  };

  const exportCsv = () => {
    window.location.href = route("admin.feedback.export" as any, activeFilters);
  };

  const rows = feedbacks?.data || [];
  const safeSummary = summary || {
    total: 0,
    average_rating: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    rating_counts: {},
  };

  return (
    <AdminLayout auth={auth} title="Customer Feedback" currentRoute="admin.feedback">
      <section className="font-['Manrope'] text-[#271310]">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47] md:mb-3 md:text-[13px]">
              Customer Voice
            </p>
            <h1 className="text-[30px] font-extrabold tracking-[-1px] md:text-[38px] md:tracking-[-1.6px]">
              Feedback Reviews
            </h1>
            <p className="mt-2 max-w-[620px] text-[13px] font-medium leading-relaxed text-[#5A4A47] md:text-[14px]">
              Review customer yang masuk setelah transaksi selesai, termasuk rating,
              order terkait, dan sentiment AI jika tersedia.
            </p>
          </div>

          <button
            onClick={exportCsv}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#DDEED8] px-5 text-[12px] font-extrabold text-[#53664F] sm:w-fit md:text-[13px]"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Feedback"
            value={String(safeSummary.total)}
            caption="review customer"
          />
          <SummaryCard
            title="Average Rating"
            value={`${safeSummary.average_rating}/5`}
            caption="berdasarkan filter aktif"
          />
          <SummaryCard
            title="Positive"
            value={String(safeSummary.positive)}
            caption="sentiment AI positive"
          />
          <SummaryCard
            title="Needs Attention"
            value={String(safeSummary.negative)}
            caption="sentiment AI negative"
          />
        </div>

        <form
          onSubmit={applyFilters}
          className="mb-6 grid grid-cols-1 gap-3 rounded-[22px] bg-[#FAFAF9] p-4 shadow-[0_12px_30px_rgba(39,19,16,0.04)] md:grid-cols-[1fr_160px_180px_auto_auto] md:items-center"
        >
          <label className="flex h-11 items-center gap-3 rounded-[12px] bg-white px-4 text-[13px] font-semibold text-[#5A4A47]">
            <Search size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search comment, customer, order ref"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-semibold text-[#271310] outline-none placeholder:text-[#A69D9A] focus:ring-0"
            />
          </label>

          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="h-11 rounded-[12px] border-0 bg-white px-4 text-[13px] font-extrabold text-[#271310] focus:ring-2 focus:ring-[#C8A96E]"
          >
            <option value="">All Rating</option>
            {[5, 4, 3, 2, 1].map((item) => (
              <option key={item} value={item}>
                {item} Stars
              </option>
            ))}
          </select>

          <select
            value={sentiment}
            onChange={(event) => setSentiment(event.target.value)}
            className="h-11 rounded-[12px] border-0 bg-white px-4 text-[13px] font-extrabold text-[#271310] focus:ring-2 focus:ring-[#C8A96E]"
          >
            <option value="">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          <button
            type="submit"
            className="h-11 rounded-[12px] bg-[#301713] px-5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="h-11 rounded-[12px] bg-white px-5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#5A4A47]"
          >
            Reset
          </button>
        </form>

        <div className="overflow-hidden rounded-[24px] bg-[#FAFAF9] p-4 shadow-[0_18px_45px_rgba(39,19,16,0.04)] md:rounded-[34px] md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[20px] font-extrabold md:text-[22px]">
                Review List
              </h2>
              <p className="mt-1 text-[12px] font-medium text-[#5A4A47]">
                Showing feedback, rating, order ref, related menu, date, and AI
                sentiment.
              </p>
            </div>
          </div>

          {rows.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <div className="min-w-[1060px]">
                  <div className="grid grid-cols-[130px_190px_1.5fr_130px_150px_170px] px-4 pb-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5A4A47]">
                    <span>Date</span>
                    <span>Order</span>
                    <span>Comment</span>
                    <span>Rating</span>
                    <span>Sentiment</span>
                    <span>Menu</span>
                  </div>

                  <div className="space-y-4">
                    {rows.map((item) => (
                      <FeedbackRow key={item.id} feedback={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 xl:hidden">
                {rows.map((item) => (
                  <FeedbackCard key={item.id} feedback={item} />
                ))}
              </div>
            </>
          ) : (
            <EmptyFeedback />
          )}

          <PaginationFooter data={feedbacks} />
        </div>
      </section>
    </AdminLayout>
  );
}

function FeedbackRow({ feedback }: { feedback: FeedbackItem }) {
  const order = feedback.order;

  return (
    <div className="grid min-h-[96px] grid-cols-[130px_190px_1.5fr_130px_150px_170px] items-center bg-white px-4">
      <div>
        <p className="text-[13px] font-extrabold">{formatDate(feedback.created_at)}</p>
        <p className="mt-1 text-[11px] font-semibold text-[#8B807D]">
          {order?.table_number ? `Table ${order.table_number}` : "No table"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-extrabold">
          {order?.order_ref || "No order ref"}
        </p>
        <p className="mt-1 truncate text-[12px] font-medium text-[#5A4A47]">
          {order?.customer_name || "Walk-in Customer"}
        </p>
      </div>

      <p className="line-clamp-3 pr-5 text-[13px] font-medium leading-relaxed text-[#5A4A47]">
        {feedback.comment || "No comment provided."}
      </p>

      <RatingStars rating={feedback.rating} />
      <SentimentBadge sentiment={feedback.sentiment_label} />

      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-[#271310]">
          {order?.menu_summary || "No menu linked"}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-[#8B807D]">
          {formatCurrency(order?.total_price || 0)}
        </p>
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: FeedbackItem }) {
  const order = feedback.order;

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#8B807D]">
            {order?.order_ref || "No order ref"}
          </p>
          <h3 className="mt-1 truncate text-[18px] font-extrabold">
            {order?.customer_name || "Walk-in Customer"}
          </h3>
          <p className="mt-1 text-[12px] font-medium text-[#5A4A47]">
            {formatDate(feedback.created_at)}
            {order?.table_number ? ` - Table ${order.table_number}` : ""}
          </p>
        </div>

        <SentimentBadge sentiment={feedback.sentiment_label} />
      </div>

      <p className="mb-4 text-[13px] font-medium leading-relaxed text-[#5A4A47]">
        {feedback.comment || "No comment provided."}
      </p>

      <div className="mb-4 flex items-center justify-between gap-3">
        <RatingStars rating={feedback.rating} />
        <span className="text-[12px] font-extrabold text-[#271310]">
          {formatCurrency(order?.total_price || 0)}
        </span>
      </div>

      <div className="rounded-[14px] bg-[#F8F8F7] p-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8B807D]">
          Related Menu
        </p>
        <p className="mt-1 text-[13px] font-bold text-[#271310]">
          {order?.menu_summary || "No menu linked"}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-[22px] bg-white p-6 shadow-[0_12px_30px_rgba(39,19,16,0.04)] md:rounded-[24px] md:p-7">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47] md:text-[12px]">
        {title}
      </p>
      <h2 className="mt-3 text-[27px] font-extrabold tracking-[-0.8px] md:text-[29px]">
        {value}
      </h2>
      <p className="mt-4 text-[11px] font-medium text-[#6F625F]">{caption}</p>
    </div>
  );
}

function RatingStars({ rating }: { rating?: number | null }) {
  if (!rating) {
    return (
      <span className="text-[12px] font-extrabold uppercase text-[#8B807D]">
        No rating
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          size={15}
          className={item <= rating ? "text-[#D99A22]" : "text-[#D8D1CE]"}
          fill={item <= rating ? "#D99A22" : "transparent"}
        />
      ))}
      <span className="ml-1 text-[12px] font-extrabold text-[#5A4A47]">
        {rating}/5
      </span>
    </div>
  );
}

function SentimentBadge({
  sentiment,
}: {
  sentiment?: FeedbackItem["sentiment_label"];
}) {
  const tone = {
    positive: "bg-[#DDEED8] text-[#53664F]",
    neutral: "bg-[#F1E8D8] text-[#7A5D2A]",
    negative: "bg-[#FFE1DF] text-[#B42318]",
    none: "bg-[#F4F4F3] text-[#8B807D]",
  };
  const label = sentiment || "none";

  return (
    <span
      className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase ${tone[label]}`}
    >
      {label === "none" ? "not analyzed" : label}
    </span>
  );
}

function EmptyFeedback() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[20px] bg-white p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F3] text-[#5A4A47]">
        <MessageSquare size={22} />
      </div>
      <h3 className="text-[18px] font-extrabold">No feedback found</h3>
      <p className="mt-2 max-w-[360px] text-[13px] font-medium leading-relaxed text-[#5A4A47]">
        Belum ada review yang cocok dengan filter saat ini.
      </p>
    </div>
  );
}

function PaginationFooter({ data }: { data?: PaginatedFeedback }) {
  if (!data) return null;

  const hasLaravelLinks = Array.isArray(data.links) && data.links.length > 0;

  return (
    <div className="mt-6 flex flex-col gap-4 px-1 md:mt-10 md:flex-row md:items-center md:justify-between md:px-4">
      <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
        Showing {data.from || 0}-{data.to || 0} of {data.total || 0} feedback
      </p>

      {hasLaravelLinks && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {data.links?.map((link, index) => {
            let label: React.ReactNode = formatPaginationLabel(link.label);

            if (String(label).includes("Previous")) {
              label = <ChevronLeft size={17} />;
            }

            if (String(label).includes("Next")) {
              label = <ChevronRight size={17} />;
            }

            return link.url ? (
              <Link
                key={index}
                href={link.url}
                preserveScroll
                preserveState
                className={`flex h-9 min-w-9 items-center justify-center rounded-[9px] px-3 text-[13px] font-extrabold ${
                  link.active
                    ? "bg-[#301713] text-white"
                    : "bg-white text-[#5A4A47]"
                }`}
              >
                {label}
              </Link>
            ) : (
              <span
                key={index}
                className="flex h-9 min-w-9 items-center justify-center rounded-[9px] bg-white/60 px-3 text-[13px] font-extrabold text-[#A69D9A]"
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}
