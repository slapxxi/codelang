import type { TUserStats } from '~/types';
import { capitalize } from '~/utils';

type UserStatsProps = {
  stats: TUserStats;
};

export const UserStats: React.FC<UserStatsProps> = (props) => {
  const { stats } = props;

  return (
    <div className="overflow-x-auto">
      <table className="mb-4 w-full max-w-prose table-auto border border-olive-200 bg-olive-100/40 backdrop-blur-px">
        <thead className="bg-olive-200 text-sm text-olive-700 uppercase">
          <tr>
            <th className="px-6 py-3 text-left">Stat</th>
            <th className="px-6 py-3 text-left">Value</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-olive-200 text-sm text-olive-800 *:even:bg-olive-100/40">
          {Object.entries(stats.statistic).map(([key, value]) => (
            <tr className="hover:bg-olive-100/50" key={key}>
              <td className="px-6 py-4 font-medium">
                {key
                  .split(/(?=[A-Z])/)
                  .map((s) => s.toLowerCase())
                  .map((s) => capitalize(s))
                  .join(' ')}
              </td>
              <td className="px-6 py-4 font-medium">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
