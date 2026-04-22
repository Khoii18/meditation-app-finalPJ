import { Edit2, Trash2 } from "lucide-react";

export function AdminTable({ data, activeTab, onEdit, onDelete }: { data: any[], activeTab: string, onEdit: (item: any) => void, onDelete: (id: string) => void }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-teal-50">
            <th className="py-4 font-bold text-[11px] uppercase tracking-widest text-slate-400">Title</th>
            <th className="py-4 font-bold text-[11px] uppercase tracking-widest text-slate-400">{activeTab === 'content' ? 'Image / Instructor' : 'Instructor'}</th>
            <th className="py-4 font-bold text-[11px] uppercase tracking-widest text-slate-400">{activeTab === 'content' ? 'Duration' : 'Time'}</th>
            <th className="py-4 font-bold text-[11px] uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item._id} className="border-b border-teal-50/50 hover:bg-teal-50/30 transition-colors">
              <td className="py-4 font-semibold text-slate-800">{item.title}</td>
              <td className="py-4 text-sm text-slate-600">
                {activeTab === 'content' && item.image && (
                  <img src={item.image} alt="thumb" className="w-10 h-10 object-cover rounded-lg inline-block mr-3 border border-teal-100/50 shadow-sm" />
                )}
                {item.instructor}
              </td>
              <td className="py-4 text-sm text-slate-500">{activeTab === 'content' ? item.duration : item.time}</td>
              <td className="py-4 text-right">
                <button onClick={() => onEdit(item)} className="p-2.5 text-teal-600 hover:bg-teal-50 rounded-xl inline-block mr-2 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(item._id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl inline-block transition-all">
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
