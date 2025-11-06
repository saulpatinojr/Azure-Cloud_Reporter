import type { Meta } from '@storybook/react';
import { colors, spacing, radii, shadows } from './tokens';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Tokens = () => (
  <div className="max-w-3xl space-y-8">
    <section>
      <h2 className="text-lg font-semibold text-slate-900">Colors</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
            <div
              className="h-10 w-16 rounded-lg border"
              style={{ background: value }}
            />
            <div>
              <p className="text-sm font-medium text-slate-800">{name}</p>
              <p className="text-xs text-slate-500">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-lg font-semibold text-slate-900">Spacing</h2>
      <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        {JSON.stringify(spacing, null, 2)}
      </pre>
    </section>

    <section>
      <h2 className="text-lg font-semibold text-slate-900">Radii</h2>
      <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        {JSON.stringify(radii, null, 2)}
      </pre>
    </section>

    <section>
      <h2 className="text-lg font-semibold text-slate-900">Shadows</h2>
      <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        {JSON.stringify(shadows, null, 2)}
      </pre>
    </section>
  </div>
);
