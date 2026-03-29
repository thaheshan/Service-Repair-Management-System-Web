const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Thahe\\Documents\\GitHub\\Service-Repair-Management-System-Web\\srm-frontend\\src\\app\\admin\\invoices\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix toLocaleString crashes (Generic replacement for all amount patterns)
content = content.replace(/inv\.amount\.toLocaleString\(\)/g, '(inv.amount ?? 0).toLocaleString()');
content = content.replace(/hiddenInvoiceTarget\.amount\.toLocaleString\(\)/g, '(hiddenInvoiceTarget.amount ?? 0).toLocaleString()');
content = content.replace(/viewDocumentTarget\.amount\.toLocaleString\(\)/g, '(viewDocumentTarget.amount ?? 0).toLocaleString()');

// 2. Fix the Row-Action Download PDF link
const oldRowAction = `<button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id)}} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] transition-all"><MoreVertical className="h-4 w-4" /></button>
                                       {activeDropdownId === inv.id && (
                                          <div className="absolute top-10 right-0 w-44 bg-white rounded-xl border border-border mt-1 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                             <button onClick={() => setActiveDropdownId(null)} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50">
                                               <Download className="h-3.5 w-3.5 text-slate-400" /> Download PDF
                                             </button>`;

const newRowAction = `<button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id)}} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] transition-all"><MoreVertical className="h-4 w-4" /></button>
                                       {activeDropdownId === inv.id && (
                                          <div className="absolute top-10 right-0 w-44 bg-white rounded-xl border border-border mt-1 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                             <button onClick={() => { handleDownloadPDF(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50">
                                               <Download className="h-3.5 w-3.5 text-slate-400" /> Download PDF
                                             </button>`;

// Using a more robust regex-based replacement for this block to ignore whitespace if possible
// But let's try direct first since RowAction is likely clean
content = content.split(oldRowAction).join(newRowAction);

// 3. Fix the Corrupted JSX Tail (Surgical line-by-line fix)
const lines = content.split(/\r?\n/);
let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Authorized Signature')) {
        // We want the SECOND occurrence (the one in the hidden target)
        if (i > 850) {
            startIndex = i;
            break;
        }
    }
}

if (startIndex !== -1) {
    // We found the corrupted tail starting at line 'startIndex'
    // We want to replace everything from here until the "EDIT INVOICE MODAL" comment
    let endIndex = -1;
    for (let j = startIndex; j < lines.length; j++) {
        if (lines[j].includes('EDIT INVOICE MODAL')) {
            endIndex = j;
            break;
        }
    }
    
    if (endIndex !== -1) {
        const newTail = [
            '                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Authorized Signature</p>',
            '                   </div>',
            '                </div>',
            '             </div>',
            '          </div>',
            '       )}',
            '    </div>',
            '',
            '        '
        ];
        lines.splice(startIndex, endIndex - startIndex, ...newTail);
        content = lines.join('\\n');
    }
}

// 4. Final Safety: Replace any remaining standalone toLocaleString on 'amount' or status
content = content.replace(/\.amount\.toLocaleString\(\)/g, '?.amount?.toLocaleString() ?? 0');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Invoice page surgically repaired successfully.');
