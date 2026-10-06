"use client";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4001/api/v1";

function download(
  endpoint: string,
) {
  window.open(
    `${API}${endpoint}`,
    "_blank",
  );
}

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Reports
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="font-bold">
            Members
          </h2>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                download(
                  "/reports/members/pdf",
                )
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              PDF
            </button>

            <button
              onClick={() =>
                download(
                  "/reports/members/excel",
                )
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              Excel
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="font-bold">
            Tithes
          </h2>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                download(
                  "/reports/tithes/pdf",
                )
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              PDF
            </button>

            <button
              onClick={() =>
                download(
                  "/reports/tithes/excel",
                )
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              Excel
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="font-bold">
            Attendance
          </h2>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                download(
                  "/reports/attendance/pdf",
                )
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              PDF
            </button>

            <button
              onClick={() =>
                download(
                  "/reports/attendance/excel",
                )
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}