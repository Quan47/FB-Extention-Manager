import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listUsers } from "@/lib/queries";
import { LogoutButton } from "@/components/logout-button";

const navSections = [
  {
    title: "GIAO DỊCH",
    items: ["Nạp tiền", "Mua gói", "Giới thiệu", "Phiên Facebook", "Lịch sử giao dịch"]
  },
  {
    title: "TIỆN ÍCH",
    items: ["Tiện ích"]
  },
  {
    title: "HỖ TRỢ",
    items: ["Hỗ trợ"]
  },
  {
    title: "TÀI KHOẢN",
    items: ["Tài khoản"]
  }
];

type TransactionRow = {
  type: string;
  amount: string;
  content: string;
  time: string;
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const users = await listUsers();
  const activeUser = users.find((u) => u.userName === session.userName) ?? users[0];
  const balance = activeUser?.balance ?? "0";
  const currentPackage = activeUser?.currentPackage ?? activeUser?.litmit ?? "0";
  const daysLeft = activeUser?.daysLeft ?? "0";
  const sessions = activeUser?.sessions ?? "0";
  const keyExtension = activeUser?.keyExtension ?? "0";
  const transactions: TransactionRow[] = parseTransactions(activeUser?.recentTransactions);

  return (
    <main className="min-h-screen border-t-4 border-[#3f3156] bg-[var(--bg)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[210px_1fr]">
        <aside className="border-r border-[var(--line)] bg-[#f8f9fc] px-3 py-4">
          <div className="rounded-xl border border-[#d8deeb] bg-[#eef2fb] p-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand)] font-bold text-white">{session.userName.slice(0, 1).toUpperCase()}</div>
              <div>
                <p className="text-sm font-semibold text-[#2c3850]">{session.userName}</p>
                <p className="text-xs text-[#f59e0b]">{balance} VNĐ</p>
              </div>
            </div>
            <button className="w-full rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-white">Tải Extension v1.8.1</button>
          </div>

          <div className="mt-3 rounded-lg border border-[#cfc2ff] bg-[var(--brand-soft)] px-3 py-2 text-sm font-semibold text-[var(--brand)]">Bảng điều khiển</div>

          {navSections.map((section) => (
            <div key={section.title} className="mt-3">
              <p className="mb-2 text-xs font-bold tracking-[0.12em] text-[#95a0b7]">{section.title}</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="rounded-md px-2 py-2 text-sm font-semibold text-[#5d6b84] hover:bg-[#edf1fb]">{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-4">
            <LogoutButton className="w-full bg-transparent text-left text-[#5d6b84]" label="Đăng xuất" />
          </div>
        </aside>

        <section className="p-4 lg:p-5">
          <h1 className="mb-3 text-[32px] font-bold tracking-tight text-[#2a3550]">Bảng điều khiển</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard value={`${balance} VNĐ`} label="Số dư tài khoản" color="bg-[#6979ff]" />
            <StatCard value={`${currentPackage}`} label="Gói hiện tại" color="bg-[#22c67a]" />
            <StatCard value={`${daysLeft}`} label="Ngày còn lại" color="bg-[#f6ae2d]" />
            <StatCard value={`${sessions}`} label="Phiên Facebook" color="bg-[#24b9db]" />
          </div>

          <section className="mt-4 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <p className="font-semibold text-[#2d3a51]">Key Extension</p>
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">Active</span>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-[var(--muted)]">Key của bạn:</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="min-w-[280px] flex-1 rounded-lg border border-[var(--line)] bg-[#fbfcff] px-3 py-2 font-mono text-sm">{keyExtension}</div>
                <button className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Copy</button>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">Lần sử dụng cuối: Chưa sử dụng</p>
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <p className="font-semibold text-[#2d3a51]">Giao dịch gần đây</p>
              <button className="rounded-lg border border-[var(--brand)] px-3 py-1.5 text-sm font-semibold text-[var(--brand)]">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f5f7fc] text-left text-xs font-bold uppercase tracking-wide text-[#95a0b7]">
                  <tr>
                    <th className="px-5 py-3">Loại</th>
                    <th className="px-5 py-3">Số tiền</th>
                    <th className="px-5 py-3">Nội dung</th>
                    <th className="px-5 py-3">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr className="border-t border-[var(--line)]">
                      <td className="px-5 py-6 text-center text-sm text-[#95a0b7]" colSpan={4}>
                        0 giao dịch
                      </td>
                    </tr>
                  ) : transactions.map((item, index) => (
                    <tr key={`${item.type}-${index}`} className="border-t border-[var(--line)]">
                      <td className="px-5 py-3">
                        <span className="rounded-md bg-[#2b77ff] px-2 py-1 text-xs font-bold text-white">{item.type}</span>
                      </td>
                      <td className={`px-5 py-3 font-semibold ${item.amount.startsWith("-") ? "text-rose-500" : "text-emerald-500"}`}>{item.amount}</td>
                      <td className="px-5 py-3 text-[#5e6b83]">{item.content}</td>
                      <td className="px-5 py-3 text-[#75839c]">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className={`mb-4 h-9 w-9 rounded-xl ${color}`} />
      <p className="text-[36px] font-bold leading-none text-[#1f2a44]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#8a96ac]">{label}</p>
    </div>
  );
}

function parseTransactions(raw: string | null | undefined): TransactionRow[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        return {
          type: String(row.type ?? "Khác"),
          amount: String(row.amount ?? "0"),
          content: String(row.content ?? "Không có nội dung"),
          time: String(row.time ?? "-")
        };
      })
      .filter((item): item is TransactionRow => item !== null);
  } catch {
    return [];
  }
}
