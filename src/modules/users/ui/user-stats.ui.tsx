import type { TUserStats } from '~/types';
import { capitalize } from '~/utils';

type UserStatsProps = {
  stats: TUserStats;
};

export const UserStats: React.FC<UserStatsProps> = (props) => {
  const { stats } = props;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-200 rounded-lg shadow-sm max-w-prose">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-6 py-3 text-left">Stat</th>
            <th className="px-6 py-3 text-left">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800 text-sm">
          {Object.entries(stats.statistic).map(([key, value]) => (
            <tr className="hover:bg-gray-50" key={key}>
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
