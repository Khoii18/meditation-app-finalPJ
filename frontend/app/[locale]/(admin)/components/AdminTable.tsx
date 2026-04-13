import { Edit2, Trash2 } from "lucide-react";

export function AdminTable({ data, activeTab, onEdit, onDelete }: { data: any[], activeTab: string, onEdit: (item: any) => void, onDelete: (id: string) => void }) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10">
            <th className="py-4 font-medium text-slate-500">Title</th>
            <th className="py-4 font-medium text-slate-500">{activeTab === 'content' ? 'Image / Instructor' : 'Instructor'}</th>
            <th className="py-4 font-medium text-slate-500">{activeTab === 'content' ? 'Duration' : 'Time'}</th>
            <th className="py-4 font-medium text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item._id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <td className="py-4 font-medium">{item.title}</td>
              <td className="py-4 text-sm text-slate-500">
                {activeTab === 'content' && item.image && (
                  <img src={item.image} alt="thumb" className="w-10 h-10 object-cover rounded-lg inline-block mr-3" />
                )}
                {item.instructor}
              </td>
              <td className="py-4">{activeTab === 'content' ? item.duration : item.time}</td>
              <td className="py-4 text-right">
                <button onClick={() => onEdit(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg inline-block mr-2 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(item._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg inline-block transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={4} className="py-8 text-center text-slate-500">No data found. Please add new items.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
