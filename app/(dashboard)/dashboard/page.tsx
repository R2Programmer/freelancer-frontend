'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { DashboardSummary } from '@/types';
import { Users, FolderKanban, Zap, ArrowRight } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_STYLES: Record<string, string> = {
  PLANNING: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  IN_PROGRESS:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  ON_HOLD:
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  COMPLETED:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  CANCELLED: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
};

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-start justify-between hover:shadow-md dark:hover:shadow-gray-950/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
    >
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 tabular-nums">
          {value}
        </p>
      </div>
      <div className={`p-2.5 rounded-xl ${iconClass}`}>
        <Icon size={18} />
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="skeleton h-8 w-16" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="space-y-1.5">
        <div className="skeleton h-3.5 w-40" />
        <div className="skeleton h-3 w-24" />
      </div>
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard
      .summary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Your business at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              label="Total Clients"
              value={summary?.totalClients ?? 0}
              icon={Users}
              iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
              href="/clients"
            />
            <StatCard
              label="Total Projects"
              value={summary?.totalProjects ?? 0}
              icon={FolderKanban}
              iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
              href="/projects"
            />
            <StatCard
              label="Active Projects"
              value={summary?.activeProjects ?? 0}
              icon={Zap}
              iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              href="/projects"
            />
          </>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Recent Projects
          </h2>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : !summary?.recentProjects.length ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <FolderKanban
                size={18}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              No projects yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Create your first project to see it here
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        ) : (
          <ul>
            {summary.recentProjects.map((project) => (
              <li
                key={project.id}
                className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {project.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {project.client?.name ?? 'No client'}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[project.status] ?? STATUS_STYLES.PLANNING}`}
                >
                  {STATUS_LABEL[project.status] ?? project.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
